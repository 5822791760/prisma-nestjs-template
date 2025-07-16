import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { Command, CommandRunner, Option } from 'nest-commander';
import * as path from 'path';

@Command({
  name: 'gen:domain',
  description:
    'Generate a new domain feature template and update domain.provider.ts',
})
export class GenCliDomain extends CommandRunner {
  async run(passedParams: string[], options: { name?: string }): Promise<void> {
    const featureName = options.name || passedParams[0];
    if (!featureName) {
      console.error('Feature name is required. Use --name <featureName>');
      return;
    }
    const baseDir = path.resolve(
      __dirname,
      '../../../core/domain',
      featureName,
    );
    const files = [
      {
        file: `${featureName}.service.ts`,
        content: this._serviceTemplate(featureName),
      },
      {
        file: `${featureName}.repo.ts`,
        content: this._repoTemplate(featureName),
      },
    ];
    await fs.mkdir(baseDir, { recursive: true });
    for (const { file, content } of files) {
      await fs.writeFile(path.join(baseDir, file), content);
    }
    await this._updateDomainProvider(featureName);
    // Lint the generated files and provider
    const providerPath = path.resolve(
      __dirname,
      '../../../core/domain/domain.provider.ts',
    );
    // Collect all generated file paths
    const generatedFiles = files.map((f) => path.join(baseDir, f.file));
    // Run lint on all relevant files in parallel
    await Promise.all([this._lintFiles([...generatedFiles, providerPath])]);
    console.log(`Domain feature '${featureName}' generated at ${baseDir}`);
  }

  @Option({
    flags: '-n, --name [string]',
    description: 'Feature name',
  })
  parseName(val: string): string {
    return val;
  }

  private _serviceTemplate(name: string) {
    const className = this._className(name) + 'Service';
    return `import { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class ${className} {\n  // Service logic here\n}\n`;
  }
  private _repoTemplate(name: string) {
    const className = this._className(name) + 'Repo';
    return `import { Injectable } from '@nestjs/common';\nimport { BaseRepo } from '@core/shared/common/common.repo';\n\n@Injectable()\nexport class ${className} extends BaseRepo {\n  // Repo logic here\n}\n`;
  }
  private _className(name: string) {
    return name.replace(/(?:^|[-_])(\w)/g, (_, c) =>
      c ? c.toUpperCase() : '',
    );
  }

  private async _updateDomainProvider(featureName: string) {
    const providerPath = path.resolve(
      __dirname,
      '../../../core/domain/domain.provider.ts',
    );
    let content = '';
    try {
      content = await fs.readFile(providerPath, 'utf8');
    } catch {
      console.error('domain.provider.ts not found!');
      return;
    }
    const ServiceClass = this._className(featureName) + 'Service';
    const RepoClass = this._className(featureName) + 'Repo';
    const serviceImport = `import { ${ServiceClass} } from './${featureName}/${featureName}.service';`;
    const repoImport = `import { ${RepoClass} } from './${featureName}/${featureName}.repo';`;
    let lines: string[] = content.split(/\r?\n/);
    // Add imports if not present
    if (!lines.some((l) => l.includes(serviceImport))) {
      const lastImportIdx = lines.reduce(
        (idx, l, i) => (l.startsWith('import ') ? i : idx),
        -1,
      );
      lines.splice(lastImportIdx + 1, 0, serviceImport, repoImport);
    }
    // Find all DOMAIN_PROVIDER arrays
    const providerIndices: number[] = [];
    lines.forEach((l, i) => {
      if (l.includes('export const DOMAIN_PROVIDER')) providerIndices.push(i);
    });
    if (providerIndices.length === 0) {
      // No provider export found, append a new one
      lines.push(
        'export const DOMAIN_PROVIDER = [',
        `  // ${this._className(featureName)}`,
        `  ${ServiceClass},`,
        `  ${RepoClass},`,
        '];',
      );
    } else {
      // Only keep the first DOMAIN_PROVIDER array, merge all providers
      const firstIdx = providerIndices[0];
      // Find start and end of the first array
      const arrStart = lines.findIndex(
        (l, i) => i >= firstIdx && l.includes('['),
      );
      let arrEnd = arrStart;
      let bracketCount = 0;
      for (let i = arrStart; i < lines.length; i++) {
        if (lines[i].includes('[')) bracketCount++;
        if (lines[i].includes(']')) bracketCount--;
        if (bracketCount === 0 && i > arrStart) {
          arrEnd = i;
          break;
        }
      }
      // Parse groups: { comment: string, providers: string[] }
      type Group = { comment: string; providers: string[] };
      const groups: Group[] = [];
      let currentGroup: Group | null = null;
      for (let i = arrStart + 1; i < arrEnd; i++) {
        const line = lines[i];
        if (line.trim().startsWith('//')) {
          if (currentGroup) groups.push(currentGroup);
          currentGroup = { comment: line.trim(), providers: [] };
        } else if (line.trim() === '') {
          if (currentGroup) groups.push(currentGroup);
          currentGroup = null;
        } else if (line.trim() && line.trim() !== ',' && line.trim() !== ']') {
          if (!currentGroup) {
            currentGroup = { comment: '', providers: [] };
          }
          currentGroup.providers.push(line.trim().replace(/,$/, ''));
        }
      }
      if (currentGroup) groups.push(currentGroup);
      // Remove any existing instances of the new providers
      for (const group of groups) {
        group.providers = group.providers.filter(
          (p) => p !== ServiceClass && p !== RepoClass,
        );
      }
      // Add new group for the new feature
      groups.push({
        comment: `  // ${this._className(featureName)}`,
        providers: [ServiceClass, RepoClass],
      });
      // Rebuild the array with correct spacing
      const rebuilt: string[] = [];
      rebuilt.push(...lines.slice(0, arrStart + 1));
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].comment) rebuilt.push(groups[i].comment);
        for (const p of groups[i].providers) {
          rebuilt.push(`  ${p},`);
        }
        if (i < groups.length - 1) rebuilt.push('');
      }
      rebuilt.push(...lines.slice(arrEnd));
      // Remove all other DOMAIN_PROVIDER arrays
      for (let i = providerIndices.length - 1; i > 0; i--) {
        const start = providerIndices[i];
        let end = start;
        let bracketCount = 0;
        for (let j = start; j < rebuilt.length; j++) {
          if (rebuilt[j].includes('[')) bracketCount++;
          if (rebuilt[j].includes(']')) bracketCount--;
          if (bracketCount === 0 && j > start) {
            end = j;
            break;
          }
        }
        if (start >= 0 && end >= start) {
          (rebuilt as string[]).splice(start, end - start + 1);
        }
      }
      lines = rebuilt;
    }
    await fs.writeFile(providerPath, lines.join('\n'));
  }

  private async _lintFiles(filePaths: string[]) {
    return new Promise((resolve) => {
      const filesArg = filePaths.map((f) => `"${f}"`).join(' ');
      exec(`npx eslint --fix ${filesArg}`, (err, stdout, stderr) => {
        if (stdout) process.stdout.write(stdout);
        if (stderr) process.stderr.write(stderr);
        resolve(true);
      });
    });
  }
}

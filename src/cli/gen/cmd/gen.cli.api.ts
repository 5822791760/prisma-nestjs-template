import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { Command, CommandRunner, Option } from 'nest-commander';
import * as path from 'path';

@Command({
  name: 'gen:api',
  description: 'Generate a new feature code template in src/app/v{version}',
})
export class GenCliApi extends CommandRunner {
  async run(
    passedParams: string[],
    options: { name?: string; version?: string },
  ): Promise<void> {
    const featureName = options.name || passedParams[0];
    const version = options.version || '1';
    if (!featureName) {
      console.error('Feature name is required. Use --name <featureName>');
      return;
    }
    const versionDir = `v${version}`;
    const baseDir = path.resolve(
      __dirname,
      `../../../app/${versionDir}`,
      featureName,
    );
    const files = [
      {
        file: `${featureName}.${versionDir}.module.ts`,
        content: this._moduleTemplate(featureName, versionDir),
      },
      {
        file: `${featureName}.${versionDir}.service.ts`,
        content: this._serviceTemplate(featureName, versionDir),
      },
      {
        file: `${featureName}.${versionDir}.repo.ts`,
        content: this._repoTemplate(featureName, versionDir),
      },
    ];
    const subDirs = [
      { dir: 'dto', files: [] },
      {
        dir: 'handler',
        files: [
          {
            file: `${featureName}.${versionDir}.http.ts`,
            content: this._handlerTemplate(featureName, versionDir),
          },
        ],
      },
    ];
    await fs.mkdir(baseDir, { recursive: true });
    for (const { file, content } of files) {
      await fs.writeFile(path.join(baseDir, file), content);
    }
    for (const { dir, files: subFiles } of subDirs) {
      const subDirPath = path.join(baseDir, dir);
      await fs.mkdir(subDirPath, { recursive: true });
      for (const { file, content } of subFiles) {
        await fs.writeFile(path.join(subDirPath, file), content);
      }
    }
    await this._updateVersionModule(versionDir, featureName);
    // Collect all generated file paths
    const generatedFiles = files.map((f) => path.join(baseDir, f.file));
    const handlerFiles = subDirs.flatMap((d) =>
      d.files.map((f) => path.join(baseDir, d.dir, f.file)),
    );
    const versionModulePath = path.resolve(
      __dirname,
      `../../../app/${versionDir}/${versionDir}.module.ts`,
    );
    // Run lint on all relevant files in parallel
    await Promise.all([
      this._lintFiles([...generatedFiles, ...handlerFiles, versionModulePath]),
    ]);
    console.log(`Feature '${featureName}' template generated at ${baseDir}`);
  }

  @Option({
    flags: '-n, --name [string]',
    description: 'Feature name',
  })
  parseName(val: string): string {
    return val;
  }

  @Option({
    flags: '-v, --version [string]',
    description: 'API version (default: 1)',
  })
  parseVersion(val: string): string {
    return val;
  }

  private _moduleTemplate(name: string, versionDir: string) {
    const className =
      this._className(name) + this._className(versionDir) + 'Module';
    const serviceName =
      this._className(name) + this._className(versionDir) + 'Service';
    const repoName =
      this._className(name) + this._className(versionDir) + 'Repo';
    const handlerName =
      this._className(name) + this._className(versionDir) + 'Http';
    return `import { Module } from '@nestjs/common';\n\nimport { ${serviceName} } from './${name}.${versionDir}.service';\nimport { ${repoName} } from './${name}.${versionDir}.repo';\nimport { ${handlerName} } from './handler/${name}.${versionDir}.http';\n\n@Module({\n  controllers: [${handlerName}],\n  providers: [${serviceName}, ${repoName}],\n})\nexport class ${className} {}\n`;
  }
  private _serviceTemplate(name: string, versionDir: string) {
    const repoName =
      this._className(name) + this._className(versionDir) + 'Repo';
    const serviceName =
      this._className(name) + this._className(versionDir) + 'Service';
    return `import { Injectable } from '@nestjs/common';\nimport { ${repoName} } from './${name}.${versionDir}.repo';\n\n@Injectable()\nexport class ${serviceName} {\n  constructor(private readonly repo: ${repoName}) {}\n  // Service logic here\n}\n`;
  }
  private _repoTemplate(name: string, versionDir: string) {
    const repoName =
      this._className(name) + this._className(versionDir) + 'Repo';
    return `import { Injectable } from '@nestjs/common';\nimport { BaseRepo } from '@core/shared/common/common.repo';\n\n@Injectable()\nexport class ${repoName} extends BaseRepo {\n  // Repo logic here\n}\n`;
  }
  private _handlerTemplate(name: string, versionDir: string) {
    const serviceName =
      this._className(name) + this._className(versionDir) + 'Service';
    const handlerName =
      this._className(name) + this._className(versionDir) + 'Http';
    const versionNum = versionDir.replace(/^v/, '');
    return `import { Controller } from '@nestjs/common';\nimport { ApiTags } from '@nestjs/swagger';\nimport { ${serviceName} } from '../${name}.${versionDir}.service';\n\n@ApiTags('${versionDir}')\n@Controller({\n  path: '${name}',\n  version: '${versionNum}',\n})\nexport class ${handlerName} {\n  constructor(private readonly service: ${serviceName}) {}\n  // Handler logic here\n}\n`;
  }
  private _className(name: string) {
    return name.replace(/(?:^|[-_])(\w)/g, (_, c) =>
      c ? c.toUpperCase() : '',
    );
  }

  private async _updateVersionModule(versionDir: string, featureName: string) {
    const versionModulePath = path.resolve(
      __dirname,
      `../../../app/${versionDir}/${versionDir}.module.ts`,
    );
    const featureClass =
      this._className(featureName) + this._className(versionDir) + 'Module';
    const featureImport = `import { ${featureClass} } from './${featureName}/${featureName}.${versionDir}.module';`;
    let content = '';
    let imports: string[] = [];
    let importLines: string[] = [];
    let insideImports = false;
    let found = false;
    let hasModuleImport = false;
    try {
      content = await fs.readFile(versionModulePath, 'utf8');
      // Parse imports
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith('import { Module } from')) {
          hasModuleImport = true;
        } else if (line.startsWith('import {')) {
          importLines.push(line);
        }
        if (line.includes('@Module({')) {
          insideImports = true;
        }
        if (insideImports && line.trim().startsWith('imports: [')) {
          const arr = line.match(/imports: \[(.*)\]/);
          if (arr && arr[1]) {
            imports = arr[1]
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
          } else {
            // Multiline imports array
            let idx = lines.indexOf(line) + 1;
            while (idx < lines.length && !lines[idx].includes(']')) {
              const mod = lines[idx].replace(/,/, '').trim();
              if (mod) imports.push(mod);
              idx++;
            }
          }
        }
      }
      // Check if already imported
      if (importLines.some((l) => l.includes(featureClass))) found = true;
      if (imports.includes(featureClass)) found = true;
    } catch {
      // File does not exist, create minimal
      content = '';
    }
    if (!found) {
      // Add import in sorted order
      importLines.push(featureImport);
      importLines = Array.from(new Set(importLines)).sort();
      // Add to imports array in sorted order
      imports.push(featureClass);
      imports = Array.from(new Set(imports)).sort();
      // Compose new content
      const moduleClass = this._className(versionDir) + 'Module';
      const moduleImportLine = `import { Module } from '@nestjs/common';`;
      let importSection = '';
      if (hasModuleImport) {
        importSection = [moduleImportLine, ...importLines].join('\n');
      } else {
        importSection = [moduleImportLine, ...importLines].join('\n');
      }
      content = `${importSection}\n\n@Module({\n  imports: [\n    ${imports.join(',\n    ')},\n  ],\n})\nexport class ${moduleClass} {}\n`;
      await fs.writeFile(versionModulePath, content);
    }
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

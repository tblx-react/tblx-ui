#!/usr/bin/env node

import { Command } from "commander";
import { existsSync, mkdirSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to registry (relative to dist/cli when built)
const REGISTRY_PATH = join(__dirname, "../../registry");

interface ComponentConfig {
  name: string;
  description: string;
  files: string[];
  dependencies?: string[];
  styles?: string[];
}

interface Registry {
  name: string;
  version: string;
  components: Record<string, ComponentConfig>;
  baseStyles: string[];
}

function loadRegistry(): Registry {
  const registryPath = join(REGISTRY_PATH, "../registry.json");
  const content = readFileSync(registryPath, "utf-8");
  return JSON.parse(content);
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src: string, dest: string) {
  ensureDir(dirname(dest));
  copyFileSync(src, dest);
  console.log(`  ✓ Created ${dest}`);
}

function addComponent(
  componentName: string,
  targetDir: string,
  registry: Registry,
  addedComponents: Set<string> = new Set()
) {
  if (addedComponents.has(componentName)) {
    return;
  }

  const component = registry.components[componentName];
  if (!component) {
    console.error(`❌ Component "${componentName}" not found in registry`);
    console.log("\nAvailable components:");
    Object.keys(registry.components).forEach((name) => {
      console.log(`  - ${name}: ${registry.components[name].description}`);
    });
    return;
  }

  addedComponents.add(componentName);

  console.log(`\n📦 Adding ${componentName}...`);

  // Add dependencies first
  if (component.dependencies) {
    for (const dep of component.dependencies) {
      addComponent(dep, targetDir, registry, addedComponents);
    }
  }

  // Copy component files
  for (const file of component.files) {
    const srcPath = join(REGISTRY_PATH, "..", file);
    const destPath = join(targetDir, file.replace("registry/", ""));
    copyFile(srcPath, destPath);
  }

  // Copy styles
  if (component.styles) {
    for (const style of component.styles) {
      const srcPath = join(REGISTRY_PATH, "..", style);
      const destPath = join(targetDir, style.replace("registry/", ""));
      copyFile(srcPath, destPath);
    }
  }
}

const program = new Command();

program
  .name("tblx-ui")
  .description("CLI to add tblx-ui components to your project")
  .version("0.1.0");

program
  .command("add <component>")
  .description("Add a component to your project")
  .option("-d, --dir <directory>", "Target directory", "src/components/tblx")
  .option("--with-base-styles", "Include base CSS variables and layout", false)
  .action((componentName: string, options: { dir: string; withBaseStyles: boolean }) => {
    console.log("\n🚀 tblx-ui - Adding components\n");

    const registry = loadRegistry();
    const targetDir = options.dir;

    // Add base styles if requested
    if (options.withBaseStyles) {
      console.log("📄 Adding base styles...");
      for (const style of registry.baseStyles) {
        const srcPath = join(REGISTRY_PATH, "..", style);
        const destPath = join(targetDir, style.replace("registry/", ""));
        copyFile(srcPath, destPath);
      }
    }

    // Add the component
    addComponent(componentName, targetDir, registry);

    console.log("\n✅ Done!");
    console.log("\n📋 Next steps:");
    console.log("  1. Make sure 'tblx' is installed: npm install tblx");
    console.log(`  2. Import the component from '${targetDir}'`);
    console.log("  3. Import the CSS styles in your app");
  });

program
  .command("list")
  .description("List all available components")
  .action(() => {
    const registry = loadRegistry();

    console.log("\n📦 Available tblx-ui components:\n");
    Object.entries(registry.components).forEach(([name, config]) => {
      console.log(`  ${name}`);
      console.log(`    ${config.description}`);
      if (config.dependencies && config.dependencies.length > 0) {
        console.log(`    Dependencies: ${config.dependencies.join(", ")}`);
      }
      console.log();
    });
  });

program.parse();

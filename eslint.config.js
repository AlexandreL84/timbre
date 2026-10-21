// @ts-check
const eslint = require("@eslint/js");
const {defineConfig, globalIgnores} = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettierRecommended = require("eslint-plugin-prettier/recommended");

const prettierOptions = {
	printWidth: 200,
	singleQuote: false,
	useTabs: false,
	tabWidth: 4,
	semi: true,
	bracketSameLine: true,
	bracketSpacing: false,
	arrowParens: "avoid",
	endOfLine: "auto",
};

module.exports = defineConfig([
	globalIgnores(["dist/", ".angular/", "coverage/", "node_modules/"]),

	// Fichiers TypeScript
	{
		files: ["**/*.ts"],
		extends: [eslint.configs.recommended, tseslint.configs.recommended, angular.configs.tsRecommended, prettierRecommended],
		processor: angular.processInlineTemplates,
		rules: {
			"prefer-const": ["error", {destructuring: "any", ignoreReadBeforeAssign: false}],
			"no-undef": "off",
			"no-case-declarations": "off",
			"no-console": ["error", {allow: ["warn", "error"]}],
			"@typescript-eslint/no-inferrable-types": "off",
			// Injection par constructeur autorisée : pas besoin de migrer vers inject() ni de commentaires eslint-disable
			"@angular-eslint/prefer-inject": "off",
			// Composants déclarés dans des NgModules (standalone: false) : autorisés tant que la migration standalone n'est pas faite
			"@angular-eslint/prefer-standalone": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			eqeqeq: ["warn", "smart"],
			"max-len": [
				"error",
				{
					code: 200,
					tabWidth: 4,
					ignoreUrls: true,
					ignoreTemplateLiterals: true,
					ignoreComments: true,
					ignorePattern: "^import .*",
				},
			],
			// Préfixes utilisés dans le projet : app- pour l'application, lib- pour les composants partagés
			"@angular-eslint/component-selector": ["error", {style: "kebab-case", type: "element", prefix: ["app", "lib"]}],
			// Directives sans préfixe imposé (trim, upperCase, noEspace...)
			"@angular-eslint/directive-selector": ["error", {style: "camelCase", type: "attribute", prefix: []}],
			"linebreak-style": "off",
			"prettier/prettier": ["error", prettierOptions],
		},
	},

	// Templates HTML
	{
		files: ["**/*.html"],
		extends: [angular.configs.templateRecommended, prettierRecommended],
		linterOptions: {
			reportUnusedDisableDirectives: "warn",
		},
		rules: {
			"prettier/prettier": ["error", {...prettierOptions, parser: "html"}],
			"@angular-eslint/template/eqeqeq": "off",
			"@angular-eslint/template/no-negated-async": "off",
		},
	},

	// Templates de composants : parser Angular de Prettier (comprend @if, @for, bindings...)
	{
		files: ["**/*.component.html"],
		rules: {
			"prettier/prettier": ["error", {...prettierOptions, parser: "angular"}],
		},
	},
]);

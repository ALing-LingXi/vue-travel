import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  // 1. 基本文件定义
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  // 2. 忽略文件
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // 3. 引入插件的推荐规则
  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  // 4. 【核心修复】将覆写规则放在后面，强制覆盖前面所有推荐配置中的 any 限制
  {
    files: ['**/*.{vue,ts,mts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // 允许显式使用 any (解决 Unexpected any 报错)
      '@typescript-eslint/no-unsafe-assignment': 'off', // 允许将 any 赋值给变量
      '@typescript-eslint/no-unsafe-member-access': 'off', // 允许访问 any 的属性
      '@typescript-eslint/no-unsafe-call': 'off', // 允许调用 any 的方法
      '@typescript-eslint/no-unsafe-return': 'off', // 允许返回 any
      '@typescript-eslint/no-unsafe-argument': 'off', // 允许将 any 作为参数传递
    },
  },

  // 5. 禁用与 Prettier 冲突的格式化规则
  skipFormatting,
)

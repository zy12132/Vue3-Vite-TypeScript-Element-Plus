export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-scss",
    "stylelint-config-recommended-vue/scss",
    "stylelint-config-html/vue",
    "stylelint-config-recess-order",
  ],
  overrides: [
    {
      files: ["**/*.{vue,html}"],
      customSyntax: "postcss-html",
      rules: {
        // 针对Vue/HTML文件禁用空源检查
        "no-empty-source": null,
      },
    },
    {
      files: ["**/*.{css,scss}"],
      customSyntax: "postcss-scss",
      // CSS/SCSS文件仍保留该规则
      rules: {
        "no-empty-source": true,
      },
    },
  ],
  rules: {
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global", "export", "v-deep", "deep"],
      },
    ],
  },
};
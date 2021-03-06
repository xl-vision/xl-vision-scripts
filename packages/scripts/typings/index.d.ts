declare module 'gulp-stylelint'
declare module 'gulp-eslint'
declare module 'gulp-clean-css'
declare module 'remark-containers'
declare module '@mdx-js/mdx'
declare module '@mapbox/rehype-prism'
declare module 'stream-to-promise'
declare module 'dart-sass'
declare module '@rollup/plugin-babel'
// 最新的dts还没有更新
declare module 'copy-webpack-plugin'
declare module 'postcss-loader'
declare module 'sass-loader'
declare module 'detect-port-alt' {
  const fn: (port: number, host: string) => Promise<number>
  export default fn
}

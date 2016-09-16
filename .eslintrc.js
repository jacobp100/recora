module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  plugins: [
    'flowtype',
  ],
  rules: {
    'no-shadow': [0],
    'arrow-parens': [0],
    'class-methods-use-this': [0],
    'import/no-extraneous-dependencies': [2, { 'devDependencies': true }],
    'flowtype/require-valid-file-annotation': [2, 'always'],
    'react/jsx-filename-extension': [0],
    'react/prop-types': [0],
  }
};

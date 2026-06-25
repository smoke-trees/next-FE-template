import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import reactCompiler from 'eslint-plugin-react-compiler'

const eslintConfig = [
	...nextCoreWebVitals,
	...nextTypescript,
	reactCompiler.configs.recommended
]

export default eslintConfig

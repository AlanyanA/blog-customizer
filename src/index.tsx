import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useCallback, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { defaultArticleState } from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	const [appliedStyles, setAppliedStyles] = useState(defaultArticleState);

	const applyStyles = useCallback((stylesObj: typeof defaultArticleState) => {
		setAppliedStyles(stylesObj);
	}, []);

	const resetStyles = useCallback(() => setAppliedStyles(defaultArticleState), []);


	return (
		<main style={{
			'--font-family': appliedStyles.fontFamilyOption.value,
			'--font-size': appliedStyles.fontSizeOption.value,
			'--font-color': appliedStyles.fontColor.value,
			'--container-width': appliedStyles.contentWidth.value,
			'--bg-color': appliedStyles.backgroundColor.value,
		} as CSSProperties} className={styles.main}>
			<ArticleParamsForm onReset={resetStyles} onApply={applyStyles} />
			<Article />
		</main>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);

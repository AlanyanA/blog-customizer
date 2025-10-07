import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
	OptionType,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

type ArticleStyles = {
	fontFamilyOption: OptionType;
	fontSizeOption: OptionType;
	fontColor: OptionType;
	backgroundColor: OptionType;
	contentWidth: OptionType;
};

type ArticleParamsFormProps = {
	onApply: (styles: ArticleStyles) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({ onApply, onReset }: ArticleParamsFormProps) => {
	const initialState: ArticleStyles = {
		fontFamilyOption: defaultArticleState.fontFamilyOption,
		fontSizeOption: defaultArticleState.fontSizeOption,
		fontColor: defaultArticleState.fontColor,
		backgroundColor: defaultArticleState.backgroundColor,
		contentWidth: defaultArticleState.contentWidth,
	};

	const sidebarRef = useRef<HTMLDivElement | null>(null);
	const [values, setValues] = useState(initialState);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const makeChangeHandler = <K extends keyof ArticleStyles>(key: K) => (
		selected: ArticleStyles[K]
	) => {
		setValues((prev) => ({ ...prev, [key]: selected } as ArticleStyles));
	};

	const handleFontFamilyChange = makeChangeHandler('fontFamilyOption');
	const handleFontSizeChange = makeChangeHandler('fontSizeOption');
	const handleFontColorChange = makeChangeHandler('fontColor');
	const handleBackgroundColorChange = makeChangeHandler('backgroundColor');
	const handleContentWidthChange = makeChangeHandler('contentWidth');

	const applyCurrent = React.useCallback(() => {
		console.log('Применяем стили:', values);
		onApply(values);
	}, [onApply, values]);

	const resetToInitial = React.useCallback(() => {
		setValues(initialState);
		onReset();
	}, [onReset]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		applyCurrent();
	};

	const handleFormReset = () => resetToInitial();

	const toggleOpen = () => setIsMenuOpen((v) => !v);
	const closeSidebar = () => setIsMenuOpen(false);

	useEffect(() => {
		if (!isMenuOpen) return;

		const onDocumentDown = (ev: MouseEvent) => {
			const target = ev.target as Node | null;
			if (sidebarRef.current && target && !sidebarRef.current.contains(target)) {
				closeSidebar();
			}
		};

		document.addEventListener('mousedown', onDocumentDown);
		return () => document.removeEventListener('mousedown', onDocumentDown);
	}, [isMenuOpen]);

	return (
		<>
			<ArrowButton isOpen={isMenuOpen} onClick={toggleOpen} />
			<aside ref={sidebarRef} className={clsx(styles.container, { [styles.container_open]: isMenuOpen })}>
				<form onReset={handleFormReset} onSubmit={handleSubmit} className={styles.form}>
					<h2 className={styles.title}>Задайте параметры</h2>
					<Select
						options={fontFamilyOptions}
						selected={values.fontFamilyOption}
						onChange={handleFontFamilyChange}
						placeholder="Выберите шрифт"
						title="шрифт"
					/>
					<RadioGroup
						options={fontSizeOptions}
						name='font-size'
						onChange={handleFontSizeChange}
						selected={values.fontSizeOption}
						title='размер шрифта'
					/>
					<Select
						options={fontColors}
						selected={values.fontColor}
						onChange={handleFontColorChange}
						placeholder="Выберите цвет"
						title='цвет шрифта'
					/>
					<Separator />
					<Select
						options={backgroundColors}
						selected={values.backgroundColor}
						onChange={handleBackgroundColorChange}
						placeholder="Выберите цвет фона"
						title='цвет фона'
					/>
					<Select
						options={contentWidthArr}
						selected={values.contentWidth}
						onChange={handleContentWidthChange}
						placeholder="Выберите ширину"
						title='ширина контента'
					/>
					<div className={styles.bottomContainer}>
						<Button type='clear' htmlType='reset' title='Сбросить' />
						<Button type='apply' htmlType='submit' title='Применить' />
					</div>
				</form>
			</aside>
		</>
	);
};
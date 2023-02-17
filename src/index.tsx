import { useImageLoad } from "@/hooks";
import React, { memo, useCallback, useState } from "react";

import ImgCrash from "@/assets/imgCrash.svg";

import styles from "./index.module.less";

interface IImageLoad {
	src: string; // 首选加载资源
	fallbackSrc?: string; // 如果加载出错的时候，优先使用fallbackSrc
	alt?: string;
	error?: boolean; // 通过外部控制的error状态
	onload?: () => void;
	onError?: () => void;
	handleClick?: () => void;
	backgroundColor: string; // loading时的背景颜色
	customStyle?: React.CSSProperties; // 自定义样式
	className?: string;
}

const ImageLoad: React.FC<IImageLoad> = (
	{
		src,
		fallbackSrc,
		alt = "加载失败",
		error = false,
		onload,
		onError,
		handleClick,
		backgroundColor = "rgb(244, 244, 244)",
		customStyle,
		className = "",
	}) => {
	const [isError, setError] = useState(false);
	const [imgMeta, loading] = useImageLoad(isError ? fallbackSrc : src);

	const onImgError = useCallback(() => {
		setError(true);
		onError && onError();
	}, [onError]);

	return (
		<div className={className} style={customStyle} onClick={handleClick}>
			{!loading ? (
				<img
					className={`${styles.img} ${isError || error ? styles.imgErr : ""}`}
					draggable={false}
					style={{
						backgroundColor,
					}}
					width="100%"
					height="100%"
					src={(isError || error) && !fallbackSrc ? ImgCrash : imgMeta?.src}
					alt={alt}
					onError={onImgError}
				/>
			) : (
				<div
					draggable={false}
					style={{
						width: "100%",
						height: "100%",
						backgroundColor,
					}}
				/>
			)}
		</div>
	);
};

export default memo(ImageLoad);

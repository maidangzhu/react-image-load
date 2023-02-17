import { FIT_IMAGE } from "@/utils";
import { useEffect, useState } from "react";

import ImgCrash from "@/assets/imgCrash.svg";

function loadImg(img: HTMLImageElement, src: string, handleError: () => void, reloadCount: number = 3) {
	if (reloadCount > 0) {
		img.onerror = function () {
			loadImg(img, src, handleError, reloadCount - 1);
		};

		img.src = src;
	} else {
		handleError();
		img.onerror = null;
		img.src = ImgCrash;
	}
}

const useImageLoad = (
	originSrc?: string,
	width?: number,
): [
	(
		| {
		src: string;
		width: number;
		height: number;
		isError: boolean;
	}
		| undefined
		),
	boolean,
] => {
	const [loading, setLoading] = useState(true);
	const [imgMeta, setImgMeta] = useState<{
		src: string;
		width: number;
		height: number;
		isError: boolean;
	}>();

	useEffect(() => {
		if (!originSrc)
			return () => {
				setLoading(false);
			};

		const img = new Image();

		let url = originSrc;
		if (width) {
			url = FIT_IMAGE(url, width);
		}

		function handleError() {
			setImgMeta({
				src: "",
				width: 0,
				height: 0,
				isError: true,
			});
			setLoading(false);
		}

		function handleLoad() {
			setImgMeta({
				src: originSrc,
				width: img.width,
				height: img.height,
				isError: false,
			});
			setLoading(false);
			img.onerror = null;
		}

		loadImg(img, url, handleError);
		img.onload = handleLoad;

		return () => {
			img.src = "";
			img.onerror = null;
			setLoading(false);
		};
	}, [originSrc, width]);

	return [imgMeta, loading];
};

export { useImageLoad };

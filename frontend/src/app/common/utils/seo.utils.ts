import { Title, Meta } from "@angular/platform-browser";
import { RouterStateSnapshot } from "@angular/router";

export interface SeoData {
	title: string;
	description: string;
	keywords: string;
	robots?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogUrl: string;
	twitterCard?: string;
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage?: string;
	[key: string]: any;
}

export function defineSeo(
	seoData: SeoData,
	titleService: Title,
	metaService: Meta,
	state?: RouterStateSnapshot,
): SeoData {
	titleService.setTitle(seoData.title);
	const tags = [
		{ name: "description", content: seoData.description },
		{ name: "keywords", content: seoData.keywords },
		{ name: "robots", content: seoData.robots || "index, follow" },
		{ property: "og:title", content: seoData.ogTitle || seoData.title },
		{
			property: "og:description",
			content: seoData.ogDescription || seoData.description,
		},
		{ property: "og:image", content: seoData.ogImage || "" },
		{ property: "og:url", content: seoData.ogUrl },
		{ name: "twitter:card", content: seoData.twitterCard || "summary" },
		{ name: "twitter:title", content: seoData.twitterTitle || seoData.title },
		{
			name: "twitter:description",
			content: seoData.twitterDescription || seoData.description,
		},
		{ name: "twitter:image", content: seoData.twitterImage || "" },
		...Object.keys(seoData)
			.filter(
				(key) =>
					![
						"title",
						"description",
						"keywords",
						"robots",
						"ogTitle",
						"ogDescription",
						"ogImage",
						"ogUrl",
						"twitterCard",
						"twitterTitle",
						"twitterDescription",
						"twitterImage",
					].includes(key),
			)
			.map((key) => {
				const parts = key.split(":");
				return parts.length === 2
					? { [parts[0]]: parts[1], content: seoData[key] }
					: { name: key, content: seoData[key] };
			}),
	];

	metaService.addTags(tags, true);
	return seoData;
}

export function createSeoData(
	title: string,
	description: string,
	keywords: string,
	imageUrl?: string,
	currentUrl?: string,
	extraData?: { [key: string]: any },
): SeoData {
	const url = currentUrl || "";
	const seo: SeoData = {
		title: title,
		description: description,
		keywords: keywords,
		ogTitle: title,
		ogDescription: description,
		ogImage: imageUrl || "",
		ogUrl: url,
		twitterTitle: title,
		twitterDescription: description,
		twitterImage: imageUrl || "",
		twitterCard: imageUrl ? "summary_large_image" : "summary",
		robots: "index, follow",
		...extraData,
	};
	return seo;
}

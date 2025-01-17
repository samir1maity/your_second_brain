interface UserData {
  link: string;
  title?: string;
  contentText?: string;
  tags?: string[];
}

interface ScrapedData {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

interface FormattedResult {
  formattedData: string;
}

export function formatDataForEmbedding(
  userData: UserData,
  scrapedData: ScrapedData = {}
): FormattedResult {
  const cleanText = (text: string): string => {
    console.log("reached to the clean text");
    return text
      .replace(/\s+/g, " ")
      .replace(/[^\w\s,.!?-]/g, "")
      .trim()
      .toLowerCase();
  };

  // 1. Process titles - combine user title and scraped titles
  const titles: string[] = [
    userData.title,
    scrapedData.ogTitle,
    scrapedData.title,
  ]
    .filter((title): title is string => Boolean(title))
    .map(cleanText)
    .filter((text, index, self) => self.indexOf(text) === index);

  // 2. Process descriptions - combine user description and scraped descriptions
  const descriptions: string[] = [
    userData.contentText,
    scrapedData.ogDescription,
    scrapedData.description,
  ]
    .filter((desc): desc is string => Boolean(desc))
    .map(cleanText)
    .filter((text, index, self) => self.indexOf(text) === index);

  // 3. Process tags
  const processedTags: string[] = userData.tags
    ? userData.tags
        .map((tag) => tag.toLowerCase())
        .map((tag) => tag.replace(/[^\w\s-]/g, ""))
        .filter((tag) => tag.length > 0)
    : [];

  const formattedData = [...titles, ...descriptions, ...processedTags].join(
    " | "
  );

  return {
    formattedData,
  };
}

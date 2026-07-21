use scraper::{Html, Selector};

pub async fn fetch_image(url: &str) -> Option<String> {
    let client = reqwest::Client::builder().timeout(std::time::Duration::from_secs(5)).build().ok()?;

    let response = client.get(url).send().await.ok()?;
    let html_text = response.text().await.ok()?;

    let document = Html::parse_document(&html_text);
    let selector = Selector::parse("meta[property='og:image']").ok()?;

    if let Some(element) = document.select(&selector).next() {
        if let Some(image_url) = element.value().attr("content") {
            return Some(image_url.to_string());
        }
    }

    None
}

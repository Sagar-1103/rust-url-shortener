use axum::{ extract::Path, response::Redirect};

pub async fn redirect_url(Path(code): Path<String>) -> Redirect {
    let url = "https://sagarshirgaonkar.com";
    Redirect::permanent(url)
}
from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "windycitycigars"
    url = "https://windycitycigars.com/product-category/pipe-tobacco-buy-online/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for element in soup.find_all("div", class_="box-text"):
            if element.find("p", class_="product-title"):
                item = element.find("p", class_="product-title").get_text().strip()
            if element.find("a", class_="woocommerce-LoopProduct-link"):
                link = element.find("a", class_="woocommerce-LoopProduct-link").get("href")
            if element.find("div", class_="price-wrapper"):
                price = element.find("div", class_="price-wrapper").get_text().strip()
            if element.find("ins"):
                price = element.find("ins").get_text().strip()
            stock = "In Stock"

            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("a", class_="next page-number"):
            soup = get_html(soup.find("a", class_="next page-number").get("href"))
        else:
            next_page = False

    return data

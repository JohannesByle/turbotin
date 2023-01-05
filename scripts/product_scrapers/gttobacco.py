from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "gttobacco"
    url = "https://gttobacco.com/product-category/pipes-tobaccos/pipe-tobaccos/"

    soup = get_html(url)
    for element in soup.find_all("div", class_="box-text"):
        if element.find("a", class_="woocommerce-LoopProduct-link"):
            item = element.find("a", class_="woocommerce-LoopProduct-link").get_text().strip()
            link = element.find("a", class_="woocommerce-LoopProduct-link").get("href")
        if element.find("div", class_="price-wrapper"):
            price = element.find("div", class_="price-wrapper").get_text().strip()
        if element.find("ins"):
            price = element.find("ins").get_text().strip()
        if element.find("div", class_="add-to-cart-button"):
            if element.find("div", class_="add-to-cart-button").get_text().strip() == "Add to cart":
                stock = "In Stock"
            if element.find("div", class_="add-to-cart-button").get_text().strip() == "Read more":
                stock = "Out of stock"
        item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

    return data

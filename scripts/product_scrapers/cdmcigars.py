from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "cdmcigars"
    url = "https://www.cdmcigars.com/product-category/pipe-tobacco"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("div", class_="col-inner"):
            for element in product.find_all("div", class_="box-text"):
                if element.find("p", class_="product-title"):
                    item = element.find("p", class_="product-title").get_text().strip()
                if element.find("a", class_="woocommerce-LoopProduct-link"):
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
        if soup.find("a", class_="next page-number"):
            soup = get_html(soup.find("a", class_="next page-number").get("href"))
        else:
            next_page = False

    return data

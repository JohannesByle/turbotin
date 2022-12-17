from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "kbven"
    url = "https://kbven.com/product-category/current-menu/tins/"
    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("div", class_="astra-shop-summary-wrap"):
            if product.find("a", class_="ast-loop-product__link"):
                item = product.find("a", class_="ast-loop-product__link").get_text().strip()
                link = product.find("a").get("href")
            if product.find("span", class_="woocommerce-Price-amount amount"):
                price = product.find("span", class_="woocommerce-Price-amount amount").get_text().strip()
            if product.find("a", class_="button").get_text().strip() == "Add to cart":
                stock = "In Stock"
            if product.find("a", class_="button").get_text().strip() == "Read more":
                stock = "Out of stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("a", class_="next page-numbers"):
            new_url = soup.find("a", class_="next page-numbers").get("href")
            soup = get_html(new_url)
        else:
            next_page = False

    return data

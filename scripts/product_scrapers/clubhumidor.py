from . import get_html, add_item
import time


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "clubhumidor"
    url = "https://www.clubhumidor.com/product-category/3-pipes-tobaccos/2-bulk-tin-tobaccos/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for products in soup.find_all("ul", class_="products")[:1]:
            for product in products.find_all("li", class_="product"):
                item = product.find("h2", class_="woocommerce-loop-product__title fbm-class").get_text().strip()
                if product.find("span", class_="woocommerce-Price-amount amount"):
                    price = product.find("span", class_="woocommerce-Price-amount amount").text
                else:
                    if product.find("bdi"):
                        price = product.find("bdi").text
                if product.find("a", class_="button").get_text() == "Read more":
                    stock = "Out of stock"
                if product.find("a", class_="button").get_text() == "Add to cart":
                    stock = "In Stock"
                link = product.find("a").get("href")

                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("a", class_="next page-numbers"):
            new_url = soup.find("a", class_="next page-numbers").get("href")
            soup = get_html(new_url)
        else:
            next_page = False

    return data

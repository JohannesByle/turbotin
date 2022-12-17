from . import get_html, add_item
import re


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "lilbrown"
    url = "https://www.lilbrown.com/product-category/pipe-tobacco/"

    soup = get_html(url)
    for cat in soup.find_all("li", class_="product-category product first"):
        link = cat.find("a").get("href")
        error = True
        wait_time = 2.75
        while error:
            try:
                new_soup = get_html(link)
                error = False
            except:
                time.sleep(wait_time)
                print("An Error Occurred: sleeping " + str(wait_time) + "s")
                wait_time = wait_time + 1
        for element in new_soup.find_all('div', class_="thunk-product"):
            if element.find("h2", class_="woocommerce-loop-product__title"):
                item = element.find("h2", class_="woocommerce-loop-product__title").get_text().strip()
            if element.find("a"):
                link = element.find("a").get("href")
            if element.find("bdi"):
                price = element.find("bdi").get_text().strip()
            if element.find("a", class_="button").get_text().strip() == "Add to cart":
                stock = "In Stock"
            if element.find("a", class_="button").get_text().strip() == "Read more":
                stock = "Out of stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

    return data

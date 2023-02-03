from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "smokersabbey"
    urls = ["https://smokersabbeyaustin.com",
            "https://smokersabbeymemphis.com"]

    for url in urls:
        soup = get_html(url + "/pipe-tobacco/")
        next_page = True
        while next_page:
            for element in soup.find_all("div", class_="entry-wrap"):
                stock = "Out of stock"
                if element.find("h3"):
                    item = element.find("h3").get_text().strip()
                    link = element.find("a").get("href")
                if element.find("bdi"):
                    price = element.find("bdi").get_text().strip()
                if element.find("ins"):
                    price = element.find("ins").get_text().strip()
                if element.find("a", class_="add_to_cart_button"):
                    stock = "In Stock"
                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
            if soup.find("a", class_="next page-numbers"):
                soup = get_html(url + soup.find("a", class_="next page-numbers").get("href"))
            else:
                next_page = False

    return data

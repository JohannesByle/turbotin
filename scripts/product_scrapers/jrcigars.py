from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "jrcigars"
    urls = ["https://www.jrcigars.com/pipe-tobacco/imported-pipe-tobacco/?sz=60",
            "https://www.jrcigars.com/pipe-tobacco/imported-pipe-tobacco/?start=60&sz=60",
            "https://www.jrcigars.com/pipe-tobacco/domestic-pipe-tobacco/?sz=60",
            "https://www.jrcigars.com/pipe-tobacco/domestic-pipe-tobacco/?start=60&sz=60"]

    for url in urls:
        soup = get_html(url)
        next_page = True
        while next_page:
            for element in soup.find_all("div", class_="item product-detail product-tile item"):
                stock = "Out of stock"
                if element.find("div", class_="item-full-name"):
                    item = (element.find("div", class_="item-desc1 text-bold").get_text().strip() + " " + element.find(
                        "div", class_="item-desc2").get_text().strip())
                if element.find("div", class_="item-link"):
                    link = ("https://www.jrcigars.com" + element.find("a").get("href"))
                if element.find("span", class_="item-price"):
                    price = element.find("span", class_="item-price").get_text().strip()
                if element.find("ins"):
                    price = element.find("ins").get_text().strip()
                if element.find("a", class_="btn btn-sm btn-orange-quick-view js-quickview"):
                    stock = "In Stock"
                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)

            else:
                next_page = False
    return data
from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "benningtons"
    url = "https://www.benningtons.com/collections/pipe-tobacco"

    soup = get_html(url)
    next_page = True
    while next_page:
        for product in soup.find_all("div", class_="product"):
            newURL = ("https://www.benningtons.com" + product.find("a").get("href"))
            resoup = get_html(newURL)
            for element in resoup.find_all("div", class_="content"):
                stock = "Out of stock"
                link = newURL
                if element.find("h2", class_="title"):
                    item = element.find("h2", class_="title").get_text().strip()
                if element.find("p", class_="price"):
                    price = element.find("p", class_="price").get_text().strip()
                if element.find("div", class_="purchase"):
                    stock = "In Stock"
                item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)


        else:
            next_page = False

    return data
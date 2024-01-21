from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "route30cigars"
    url = "https://route30cigars.com/search?options%5Bprefix%5D=last&page=1&q=%22pipe+tobacco+-%22"

    soup = get_html(url)
    next_page = True
    while next_page:
        for element in soup.find_all("div", class_="card__content"):
            if element.find("h3", class_="h5"):
                item = element.find("a", class_="full-unstyled-link").get_text().strip()[15:]
                link = ("https://route30cigars.com" + element.find("a", class_="full-unstyled-link").get("href"))
                stock = "In Stock"
            if element.find("div", class_="price__regular"):
                price = element.find("span", class_="price-item--regular").get_text().strip()
            if element.find("span", class_="badge badge--bottom-left color-background-1"):
                if element.find("span",
                                class_="badge badge--bottom-left color-background-1").get_text().strip() == "Sold out":
                    stock = "Out of stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("a", class_="pagination__item--prev"):
            soup = get_html("https://route30cigars.com" + soup.find("a", class_="pagination__item--prev").get("href"))
        else:
            next_page = False

    return data

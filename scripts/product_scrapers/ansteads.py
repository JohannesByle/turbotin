from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "ansteads"
    url = "https://www.shopansteads.com/everything-pipes/tinned-pipe-tobacco/"

    soup = get_html(url)
    next_page = True
    while next_page:
        for element in soup.find_all("div", class_="product-block"):
            if element.find("h4"):
                stock = ""
                item = element.find("h4").get_text().strip()
                link = element.find("a", class_="title").get("href")
            if element.find("div", class_="product-block-price"):
                price = element.find("div", class_="product-block-price").get_text().strip()
            if element.find("div", class_="product-block-label label-outofstock"):
                stock = "Out of stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("li", class_="next"):
            link = soup.find("li", class_="next").find("a")
            soup = get_html(link.get("href"))
        else:
            next_page = False

    return data

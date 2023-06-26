from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "davidus"
    url = "https://www.davidus.com/pipe-tobacco.html"

    soup = get_html(url)
    next_page = True
    while next_page:
        for element in soup.find_all("div", class_="product details product-item-details"):
            if element.find("h2", class_="product name product-item-name"):
                item = element.find("h2", class_="product name product-item-name").get_text().strip()
            if element.find("a", class_="product-item-link"):
                link = element.find("a", class_="product-item-link").get("href")
            if element.find("span", class_="price"):
                price = element.find("span", class_="price").get_text().strip()
            if element.find("div", class_="actions-primary"):
                stock = "In Stock"
            if element.find("div", class_="stock unavailable"):
                stock = "Out of stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("a", class_="action next"):
            soup = get_html(soup.find("a", class_="action next").get("href"))
        else:
            next_page = False

    return data

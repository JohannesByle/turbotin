from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "smittyscigars"
    url = "https://smittyscigars.com/collections/all-pipe-tobaccos"

    soup = get_html(url)
    page = 1
    next_page = True
    while next_page:
        for element in soup.find_all("div", class_="card"):
            if element.find("h3"):
                stock = "In Stock"
                item = element.find("h3").get_text().strip()
            if element.find("a", class_="card__wrapper"):
                link = ("https://smittyscigars.com" + element.find("a", class_="card__wrapper").get("href"))
            if element.find("div", class_="card__price"):
                price = element.find("div", class_="card__price").get_text().strip()
            if element.find("div", class_="card__availability"):
                stock = "Out of stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("span", class_="pagination__page pagination__page--current"):
            page = page + 1
            soup = get_html(url + "?page=" + str(page))
        else:
            next_page = False

    return data

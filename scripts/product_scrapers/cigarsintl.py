from . import get_html, add_item


def scrape(pbar=None):
    item, price, stock, link = ["", "", "", ""]
    data = []
    name = "cigarsintl"
    url = "https://www.cigarsinternational.com/shop/pipe-tobacco/1800049/"

    soup = get_html(url)

    next_page = True
    while next_page:
        for product in soup.find_all("div", class_="category-list-details"):
            for element in product.find_all():
                if element.get("class"):
                    if " ".join(element.get("class")) == "price-amount":
                        price = "$" + element.get("data-value")
                    if " ".join(element.get("class")) == "product-brand-heading":
                        item = element.get_text().strip()
                    if " ".join(element.get("class")) == "title":
                        link = ("https://www.cigarsinternational.com" + element.get("href"))
                    if " ".join(element.get("class")) == "d-inline-block":
                        stock = element.get_text().strip()
                        if stock == "Out Of Stock":
                            stock = "Out of stock"
            item, price, stock, link = add_item(data, name, item, price, stock, link, pbar)
        if soup.find("ul", class_="pagination"):
            status = soup.find_all("li", class_="page-item")
            if status[-1].find("span", class_="link-disabled"):
                next_page = False
            else:
                new_url = "https://www.cigarsinternational.com" + status[-1].find("a").get("href")
                soup = get_html(new_url)

    return data

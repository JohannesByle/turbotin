from tqdm import tqdm
import urllib.request as request
from bs4 import BeautifulSoup


def get_html(url):
    req = request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = request.urlopen(req)
    return BeautifulSoup(response.read(), features="lxml")


def get_reviews():
    page = 1
    review_data = []
    soup = get_html("https://www.tobaccoreviews.com/browse/?pagenumber=" + str(page))
    next_page = True
    while next_page:
        for tr in tqdm(soup.find_all("tr", class_="trTableRow"), desc="Getting reviews"):
            if tr.find("a"):
                sub_soup = get_html(tr.find("a").get("href"))
                for sub_tr in sub_soup.find_all("tr", class_="trTableRow"):
                    if sub_tr.find("a") and sub_tr.find("a").get("href") != "#reviews":
                        brand = tr.find("a").get_text()
                        blend = sub_tr.find("a").get_text()
                        review_data.append({"brand": brand,
                                            "blend": blend,
                                            "link": sub_tr.find("a").get("href"),
                                            "score": sub_tr.find_all("td")[2].get_text().strip(),
                                            "brand_link": tr.find("a").get("href"),
                                            "full_name": brand + " " + blend})
        if soup.find("i", class_="fa-solid fa-angles-right"):
            page = page + 1
            soup = get_html("https://www.tobaccoreviews.com/browse/?pagenumber=" + str(page))
        else:
            next_page = False
    return review_data
from src.appglobals import g


# ToDo: Remove this and get from DB
def get_metadata():
    if g.version == "sweden":
        return {
            "title": "Sweden lettfaktura",
            "description": "The best invoice manager in sweden",
            "favicon": "https://i.ibb.co/R6hDcvT/icons8-invoice-24.png",
        }

    else:
        return {
            "title": "Norway lettfaktura",
            "description": "The best invoice manager in norway",
            "favicon": "https://www.lettfaktura.no/images/favicon.jpg",
        }

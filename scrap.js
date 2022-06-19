let obj1 = {
    "language": "en",
    "textAngle": 0.0,
    "orientation": "Up",
    "regions": [
        {
            "boundingBox": "172,151,525,712",
            "lines": [
                {
                    "boundingBox": "172,151,227,71",
                    "words": [
                        {
                            "boundingBox": "172,151,227,71",
                            "text": "Team"
                        }
                    ]
                },
                {
                    "boundingBox": "268,814,429,49",
                    "words": [
                        {
                            "boundingBox": "268,814,188,49",
                            "text": "Atakan"
                        },
                        {
                            "boundingBox": "481,814,216,49",
                            "text": "Nalbant"
                        }
                    ]
                }
            ]
        },
        {
            "boundingBox": "956,814,317,61",
            "lines": [
                {
                    "boundingBox": "956,814,317,61",
                    "words": [
                        {
                            "boundingBox": "956,816,148,59",
                            "text": "Büsra"
                        },
                        {
                            "boundingBox": "1129,814,144,61",
                            "text": "Bilgin"
                        }
                    ]
                }
            ]
        },
        {
            "boundingBox": "1692,813,477,62",
            "lines": [
                {
                    "boundingBox": "1692,813,477,62",
                    "words": [
                        {
                            "boundingBox": "1692,813,126,50",
                            "text": "Utku"
                        },
                        {
                            "boundingBox": "1843,813,326,62",
                            "text": "Demiryakan"
                        }
                    ]
                }
            ]
        },
        {
            "boundingBox": "174,995,1919,116",
            "lines": [
                {
                    "boundingBox": "177,995,1916,62",
                    "words": [
                        {
                            "boundingBox": "177,995,106,50",
                            "text": "This"
                        },
                        {
                            "boundingBox": "305,999,144,46",
                            "text": "Team"
                        },
                        {
                            "boundingBox": "471,995,204,50",
                            "text": "worked"
                        },
                        {
                            "boundingBox": "682,995,89,62",
                            "text": "for"
                        },
                        {
                            "boundingBox": "787,998,303,59",
                            "text": "generating"
                        },
                        {
                            "boundingBox": "1109,995,235,50",
                            "text": "inclusive"
                        },
                        {
                            "boundingBox": "1361,995,249,50",
                            "text": "solutions"
                        },
                        {
                            "boundingBox": "1629,998,47,47",
                            "text": "in"
                        },
                        {
                            "boundingBox": "1692,995,401,50",
                            "text": "Accessibilitech"
                        }
                    ]
                },
                {
                    "boundingBox": "174,1061,312,50",
                    "words": [
                        {
                            "boundingBox": "174,1061,312,50",
                            "text": "Hackathon."
                        }
                    ]
                }
            ]
        }
    ],
    "modelVersion": "2021-04-01"
}


let obj2 = {
    "objects": [
        {
            "rectangle": {
                "x": 1807,
                "y": 515,
                "w": 246,
                "h": 98
            },
            "object": "Glasses",
            "confidence": 0.673,
            "parent": {
                "object": "Personal care",
                "confidence": 0.673
            }
        },
        {
            "rectangle": {
                "x": 950,
                "y": 322,
                "w": 484,
                "h": 500
            },
            "object": "person",
            "confidence": 0.761
        },
        {
            "rectangle": {
                "x": 272,
                "y": 404,
                "w": 401,
                "h": 462
            },
            "object": "person",
            "confidence": 0.801
        },
        {
            "rectangle": {
                "x": 1655,
                "y": 377,
                "w": 502,
                "h": 486
            },
            "object": "person",
            "confidence": 0.838
        }
    ],
    "requestId": "040cc237-73a8-4f55-b6c0-e7e71838dc52",
    "metadata": {
        "height": 1324,
        "width": 2364,
        "format": "Png"
    },
    "modelVersion": "2021-04-01"
}

description([obj1, obj2]);

















let obj1 = {
    "language": "en",
    "textAngle": 0.0,
    "orientation": "Up",
    "regions": [
        {
            "boundingBox": "174,146,1163,94",
            "lines": [
                {
                    "boundingBox": "174,146,1163,94",
                    "words": [
                        {
                            "boundingBox": "174,146,264,76",
                            "text": "About"
                        },
                        {
                            "boundingBox": "466,146,141,76",
                            "text": "the"
                        },
                        {
                            "boundingBox": "644,151,405,89",
                            "text": "European"
                        },
                        {
                            "boundingBox": "1089,150,248,72",
                            "text": "Union"
                        }
                    ]
                }
            ]
        }
    ],
    "modelVersion": "2021-04-01"
}

let obj2 = {
    "objects": [],
    "requestId": "2e4b9096-4313-46f9-bb13-9300942ee82a",
    "metadata": {
        "height": 1316,
        "width": 2348,
        "format": "Png"
    },
    "modelVersion": "2021-04-01"
}

description([obj1, obj2]);
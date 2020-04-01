# Reviews API

This application is an API designed to manage and route requests to a PostgreSQL. The routes can process GET, POST, and PUT requests to retrieve data based on product ID, update parts of the review data, and add new reviews to the database. The database current manages reviews submitted base on over 1 million products and has been designed for use for an eCommerce platform.

## Routes:

### Review list:

**_GET/reviews/:productId/list_** - Retrieves and returns a list of reviews based on product ID. It will exclude reviews that were tagged as reported.

| Parameter | Type    | Description                                                                              |
|-----------|---------|------------------------------------------------------------------------------------------|
| productId | integer | Indicator for which reviews to retrieve from the database. (Required)                    |
| page      | integer | Determines which page of reviews to retrieve. Default is 1.                              |
| count     | integer | Determines the number of reviews to retrieve per page. Default is 5.                     |
| sort      | string  | Determines the sorting of reviews. Default = 'relevance' Options = ['newest', 'helpful'] |

### Review Metadata: 

**_GET/reviews/:productId/meta_** - Retrieves and returns metadata related to reviews based on product ID.

| Parameter | Type    | Description                                                          |
|-----------|---------|----------------------------------------------------------------------|
| productId | integer | The product from which review metadata will be retrieved. (Required) |

### Post Review:

**_POST/reviews/:productID_** - Posts a new review based on product ID.

| Parameter | Type    | Description                                                                 |
|-----------|---------|-----------------------------------------------------------------------------|
| productID | integer | Indicates which product the posted review will be associated to. (Required) |

**Body:**

| Parameter       | Type     | Description                                                                                                                                                                                                                            |
|-----------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| body            | string   | Full text of the review. (Required)                                                                                                                                                                                                    |
| characteristics | object   | Ratings of characteristics associated with the product. Key is characteristic ID  associated with product. Value should be an integer rating between 1 and 5.Should  be formatted as follows: {'1' : 5, '2' : 4, '3' : ...} (Required) |
| email           | string   | Email of user associated with review. (Required)                                                                                                                                                                                       |
| photos          | [string] | Array of image urls associated with review.                                                                                                                                                                                            |
| rating          | integer  | Rating of review. Should be integer between 1 and 5. (Required)                                                                                                                                                                        |
| recommend       | boolean  | Indicates whether reviewer recommends product. (Required)                                                                                                                                                                              |
| reviewerName    | string   | Name or pseudonym of reviewer. (Required)                                                                                                                                                                                              |
| summary         | string   | Brief description of review. (Required)                                                                                                                                                                                                |

### Mark Review Helpful:

**_PUT/reviews/helpful/:reviewId_** - Increases helpfulness of a review based on review ID. It will increment helpfulness by 1.

| Parameter | Type    | Description                                                 |
|-----------|---------|-------------------------------------------------------------|
| reviewId  | integer | Indicates which review to increment helpfulness. (Required) |

### Report Review:

**_PUT/reviews/report/:reviewId_** - Marks a review as reported based on review ID. *NOTE* Reviews marked as reported will no longer be retrieved when retriving review list.

| Parameter | Type    | Description                                            |
|-----------|---------|--------------------------------------------------------|
| reviewId  | integer | Indicates which review to mark as reported. (Required) |


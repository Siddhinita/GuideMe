# GuideMe
GuideMe is a guiding system that interacts with customers in a shop and assists them in locating items and finding their way around the shop, thus making the overall shopping experience easier and enjoyable.<br/>
GuideMe uses a Google Assistant integrated application that takes in user query about the products in the shop and informs them about the availability, price and other details.This has been implemented by the Dialogflow API.<br/>
Once the user expresses desire to buy the product, GuideMe interacts with the physical robot turtlebot which then leads the user to correct location.<br/>
The application is linked to Firebase that contains the product information and its respective location that is derived from the 2D map generated by the lidar scan of the turtlebot around the shopping area.<br/> 
This concept can be exptended to other scenarios like libraries or offices where a guiding system is required.<br/>

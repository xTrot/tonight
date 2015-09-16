**Introduction**
- The purpose of this document is to present a general idea of the concept of the project that will be worked on during the semester. It will detail the requirements needed to consider our project a working program as well as the materials used during this process. This document's intended readers are the course professors and teaching assistant who will be the ones to evaluate our work at the end of each phase.  

**Scope**:
- Name of the product: Tonight.
- What the product will do: The product will be a social networking mobile web application whose functionality will include the ability to allow the user to create a profile page using their email, make posts within this page, add or delete friends, and create or delete groups, events, and business pages. The product will also be responsible for sending an email, per day at 6PM local time, to the user when they receive one notification or more from the above mentioned functions; this is a default time and can be changed by the user. It will include a special function that will allow the user to be able to create an event invite that will start in the next 24 hours, this special event will be called a “hang”. It's purpose is to create a meeting place where the user details and sends an invitation to their friends for meeting up as a spontaneous occurrence, usually tonight.
- What the product will not do: The product will not allow the user to tag their friends in any post that the user makes without explicit permission of said friend. It will not allow the user to have any type of communication with other users outside of the web application. The product will not allow the user to purchase or sell anything from business pages or allow the transfer of money through the application.
- Description of the benefits, goals, and objectives: The goal of the project is to create a secure and stress free social network that will benefit the user by getting rid of the possibility of having information accidentally leaked through the unwanted tagging of their page in other user's photos or messages. The objective is for the user to feel secure while having a place where they keep in contact with their family and friends. Another objective is that the product gives the user a way to create spontaneous events where they can meet up with other users without unwanted users finding out about it.

**Definitions/abbreviations**
- Terms:
  - Hang: A function of the product to allow the user to create a spontaneous meet up location for other specified users to go in a 24 hour time range.
- Abbreviations:
  - N/A
 
**References**
- Course Textbook: Database System Concepts 6th edition by Abraham Silberschatz et al. 

**Overview**
- General Description
  - Product Perspective 
  - System Evolution
  - Product Functions
  - Users
  - General Constraints
  - Assumptions/Dependencies 


**General Description**
- Product perspective
  - This is an independent product that will have a client and server side as well as a database.
  - Since it is an independent product, it will not have any other components.
  - The interfaces will be used only between this product and to no other application.
  - There won't be any hardware used since the entire product will be software based.
- System evolution
  - Spiral Lifecycle model
    - Analysis
    - Evaluation
    - Development
    - Planning next step
    - Repeat all until done
  - Training setup intended. 
    - The app is planned to be very straightforward and should not require any training. After testing with potential app users, if they have any trouble, an in-app on-screen tutorial will be added.
  - Installation method intended. 
    - No installation required, the whole application should be accessible via URL from a mobile device.
- Product functions
  - The product will allow the user to create a profile page with their emails and   - determine whether it is business or personal.
  - The user will be able to add, delete, and categorize other users as friends.
  - The user will be able to create, delete, and categorize groups.
  - The user will be able to create, delete, and invite friends or groups to events.
  - The user will be able to create a special “hang” event that can be public or private.
  - The user will receive an email of any notifications from previous functions.
- Users
  - Teenagers and young adults
    - Do not need experience, training, or technical expertise to be able to use this web application.
    - Will be the target audience since they are more closely related to social media and will most likely use the special function “hang”.
    - High priority.
  - Adults
    - Do not need experience, training, or technical expertise to be able to use this web application.
    - Is expected of them to use this web application to stay in contact with friends and family and rarely use the special function “hang”.
    - Medium priority.
  - Business owners
    - Do not need experience, training, or technical expertise to be able to use this web application.
    - Is expected of them to use the web application to promote their business by detailing in their pages descriptions of products and/or services they offer.
    - Business owners and pages are not expected to use the special function “hang”.
    - Low priority.
- General constraints
  - All information provided by the user for the creation of their page will remain strictly confidential and private. No other user will be able to access this data and it will only be visible to the creators of the application.
  - Any written post made public has the right to freedom of speech.
  - Any post of photos or videos can not contain nudity, gore, or any type of graphic content deemed inappropriate for our target audience.
  - Since the project is only software related, there will be no hardware constraints.
- Assumptions and dependencies
  - We are assuming that our only goal is to create a social network web application that will provide a stress free and secure environment for the users to communicate with friends and family. We have taken teenagers and young adults as our target audience and placed their needs as the central concept behind our requirements to create a special function to differentiate our product from other similar products already in the market. We depend on the fact that we have interpreted all the information provided to us by our professors correctly for this product to be a success and any misinterpretation may lead to changes in the specifications on a later date.

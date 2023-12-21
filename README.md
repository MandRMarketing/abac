# Dev Notes for Hannon Hill

# If any questions or issues come up that aren't addressed below, please contact me at logan@mandr-group.com

Aside from the header and footer, I have built out the following modules that make up every page we have built out:

1. Standard Content
2. Callout
3. Callout Image
4. Cards
5. Full Width
6. Instagram Feed
7. News Grid
8. News Archive (multiple layouts)
9. News Single
10. Program Archive
11. Secondary Page Banner
12. Slider
13. Toggles

Each module uses the same html layout, but has different css classes that should be applied to alter the layout/look of the module depending on which the client wants to use. I envision you all will build these out as toggles of some sort in backend framemwork, where the user can select which class they want to use for the layout. There are also a couple other general classes that can apply of these layouts: section-wrap, no-padding-top, no-padding-bot. The section wrap class applies general padding to the layout, while the other two remove padding on either the top or bottom of the layout respectively. I also envision these as toggles the user can select.

The styles for all these layouts can be found in the assets/scss/layout folder. Each layout has an associated file that is appropriately named. Below are notes on each of the layouts and their associated classes:

1. Standard Content (.standard-content)
    - Purpose: For standard content blocks with headers, text, and images.
    - Classes: .button-group, .intro-text
    - Misc. Notes: .column elements are added inside of this section to add multiple columns if necessary
2. Callouts (.callout)
    - Purpose: For call to action blurbs that have left and right content.
    - Classes: n/a
3. Callout Image (.callout-image)
    - Purpose: For call to action blurbs that require a background image and are in a single column.
    - Classes: n/a
4. Cards (.cards)
    - Purpose: For content contained inside of card styled containers.
    - Classes: .quote, .icons, .announcement, .borders, .stats, .single-row
5. Full Width (.full-width)
    - Purpose: For content that needs to take up the full width of the screen.
    - Classes: .fifty-fifty, .forty-sixty, .image-right, .image-left, .program-single-info
    - Misc. Notes: The left and right classes contained within the .full-width module have an optional .stallion-bg class that can be applied.
6. Instagram Feed (.instagram-feed)
    - Purpose: For linking and displaying images taken from ABAC's instagram account.
    - Classes: n/a
7. News Grid (.news-grid)
    - Purpose: For showing ABAC's most recent news articles posted to the site on pages outside of the dedicated news pages.
    - Classes: n/a
8. News Archive (.featured-articles, .news-articles)
    - Purpose: Layouts that make up the entire news archive page.
    - Classes: n/a
    - Misc. Notes: This is not a single layout, rather a few that makeup the whole page. To my understanding this whole page counts as a module for you guys. It is made up of the following sections: .featured-articles, .news-articles.
9. News Single (.news-article-single)
    - Purpose: Layout that make up the entire single news article pages.
    - Classes: n/a
10. Program Archive (.program-archive)
    - Purpose: Layout that make up the entire programs archive page.
    - Classes: n/a
11. Secondary Page Banner (.secondary-page-banner)
    - Purpose: Layout for the header banner on secondary pages.
    - Classes: .faded-bg-banner, .info-banner, .school-single-banner
12. Slider (.slider)
    - Purpose: For content contained within areas that are slideable to the left or right.
    - Classes: .image-overlays, .rotating-content-image, .front-page-slider
    - Misc. Notes: There is a slider on the top of the homepage that is specific to that page. All styling related to this slider is contained in the front-page.scss file
13. Toggles (.toggles)
    - Purpose: For content contained within areas that can be toggled open and closed.
    - Classes: .image-content-box-overlay, .image-overlays
    - Misc. Notes: The toggleable content inside of .image-overlays toggles should be limited to roughly 500 characters.

Other notes:

-   Button anchor elements (.button, .button-lg, .button-arrow) can have a .link-spanner element inside of them that allows them to take up the entirety of their container element. This is espcially useful for the card layouts and is used there often.
-   Background images for cenrtain sections that use an image as a background are set inline instead of in an scss. I did this premptively assuming that it'll be easier for you guy's to handle sections like that in this fashion when building out the backend. I envision the client will be able to supply the background image through the UI.

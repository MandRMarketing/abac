# Dev Notes for Hannon Hill

## Contact Information

If you have any questions or encounter issues not addressed below, please feel free to reach out to me at [logan@mandr-group.com](mailto:logan@mandr-group.com).

## Overview

This document provides information on the modules used in the development of pages for Hannon Hill. Apart from the header and footer menus, the following modules constitute the structure of each page:

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

## Module Details

### Each module uses the same html layout, but has different css classes that should be applied to alter the layout/look of the module depending on which the client wants to use. I envision you all will build these out as toggles of some sort in backend framemwork, where the user can select which class they want to use for the layout. There are also a couple other general classes that can apply to these layouts: section-wrap, no-padding-top, no-padding-bot. The section wrap class is for applying consistent padding to all layouts, while the other two remove padding on either the top or bottom of the layout respectively. I envision these as toggles the user can select. The styles for all these layouts can be found in the assets/scss/layout folder. Each layout has an associated file that is appropriately named. Below are notes on each of the layouts and their associated classes:

### 1. Standard Content (.standard-content)

-   **Purpose:** For standard content blocks with headers, text, and images.
-   **Classes:** .button-group, .intro-text, .single-card
-   **Misc. Notes:** Use additional .column elements inside this section for multiple columns if necessary.

### 2. Callouts (.callout)

-   **Purpose:** For call-to-action blurbs with left and right content.
-   **Classes:** N/A

### 3. Callout Image (.callout-image)

-   **Purpose:** For call-to-action blurbs with a background image in a single column.
-   **Classes:** N/A

### 4. Cards (.cards)

-   **Purpose:** For content contained inside card-styled containers.
-   **Classes:** .quote, .icons, .announcement, .borders, .stats, .single-row

### 5. Full Width (.full-width)

-   **Purpose:** For content that needs to take up the full width of the screen.
-   **Classes:** .fifty-fifty, .forty-sixty, .image-right, .image-left, .program-single-info
-   **Misc. Notes:** Left and right classes within the .full-width module may have an optional .stallion-bg class.

### 6. Instagram Feed (.instagram-feed)

-   **Purpose:** For linking and displaying images from ABAC's Instagram account.
-   **Classes:** N/A

### 7. News Grid (.news-grid)

-   **Purpose:** For displaying ABAC's most recent news articles on pages outside dedicated news pages.
-   **Classes:** N/A

### 8. News Archive (.featured-articles, .news-articles)

-   **Purpose:** Layouts constituting the entire news archive page.
-   **Classes:** N/A
-   **Misc. Notes:** This is not a single layout but a combination of .featured-articles and .news-articles sections.

### 9. News Single (.news-article-single)

-   **Purpose:** Layouts for individual news article pages.
-   **Classes:** N/A

### 10. Program Archive (.program-archive)

-   **Purpose:** Layouts for the entire programs archive page.
-   **Classes:** N/A

### 11. Secondary Page Banner (.secondary-page-banner)

-   **Purpose:** Layout for the header banner on secondary pages.
-   **Classes:** .faded-bg-banner, .info-banner, .school-single-banner

### 12. Slider (.slider)

-   **Purpose:** For content within areas that are slideable left or right.
-   **Classes:** .image-overlays, .rotating-content-image, .front-page-header
-   **Misc. Notes:** The homepage slider has specific styling in the front-page.scss file.

### 13. Toggles (.toggles)

-   **Purpose:** For content within areas that can be toggled open and closed.
-   **Classes:** .image-content-box-overlay, .image-overlays
-   **Misc. Notes:** Limit toggleable content inside .image-overlays toggles to roughly 500 characters.

## Additional Notes

-   If you have any issues/questions, see anything missing, or need any changes made, email [logan@mandr-group.com](mailto:logan@mandr-group.com).

-   Button anchor elements (.button, .button-lg, .button-arrow) can contain a .link-spanner element to take up the entirety of their container, particularly useful for card layouts.

-   Background images for sections using images as a background are set inline, anticipating ease of use for backend development. Assuming the client will be able to supply background images through the UI.

-   There are other places where inline styles are used, all of which are assumed will be areas where content can be added via a text editor that would have options to add these inline stylings.

-   Menu items have a .current-item class that will need to be applied depending on which page you are on.

-   There are several classes inside base.scss that are used across all pages such as: .mobile-img-hide, .mobile-hide, .desktop-hide, .sr-only, .block

-   The footer and header elements are the same in each HTML file. The header is split into both a desktop and mobile nav.

-   Not every page has been built on our end only certain ones that allow for all the different modules to be exemplified. These are all the HTML files in this folder aside from the placeholder.html folder that takes the place of all the pages we didn't build.

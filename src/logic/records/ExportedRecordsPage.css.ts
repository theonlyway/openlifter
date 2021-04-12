const borderRadius = "0px";

export const exportedRecordsPageCss = `
body {
    background-color: white;
}

th, td {
    text-align: left;
    padding-right: ${borderRadius};
}

tr {
    min-width: 80px;
}

table {
    font-size: 18px;
    background-color: white;
    border-bottom-left-radius: ${borderRadius};
    border-bottom-right-radius: ${borderRadius};
}

.tinyColumn {
    min-width: 60px;
}

.smallColumn {
    min-width: 95px;
}

.mediumColumn {
    min-width: 130px;
}

.largeColumn {
    min-width: 240px;
}

.recordsPage {
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    color: black;
}

.recordsPageTitle {
    font-size: 50px;
    font-weight: bold;
}

.categoryHeading {
    font-size: 30px;
    background-color: black;
    color: white;
    font-weight: bold;
    padding: 4px;
    margin: 0px;
    border-top-left-radius: ${borderRadius};
    border-top-right-radius: ${borderRadius};
}

.recordCategory {
    border-style: solid;
    margin-bottom: 10px;
    max-width: 100%;
}

.logoContainer {
    background-color: black;
    width: 100%;
    display: flex;
    justify-content: space-around;
}

.responsiveImage {
    max-width: 100%;
}

`;

const borderRadius = "8px";

export const exportedRecordsPageCss = `
body {
    background-color: #dfe4e6;
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
    background-color: lightgray;
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
}

.recordsPageTitle {
    font-size: 50px;
    font-weight: bold;
}

.categoryHeading {
    font-size: 30px;
    background-color: #232323;
    color: #FFFFFF;
    font-weight: bold;
    padding: 4px;
    margin: 10px 0px 0px 0px;
    border-top-left-radius: ${borderRadius};
    border-top-right-radius: ${borderRadius};
}
`;

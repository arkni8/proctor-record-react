'use client'

import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

const surveyJson = {
    elements: [{
        name: "FirstName",
        title: "Enter your first name:",
        type: "text"
    }, {
        name: "LastName",
        title: "Enter your last name:",
        type: "text"
    }]
};

export default function App() {
    const survey = new Model(surveyJson);

    return <Survey model={survey} />;
}

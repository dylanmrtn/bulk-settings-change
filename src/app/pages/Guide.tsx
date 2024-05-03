import { Button, Markdown, Paragraph } from "@dynatrace/strato-components-preview";
import { ChevronLeftIcon } from "@dynatrace/strato-icons";
import React from 'react';
import { Link } from "react-router-dom";


const guide = `
# Bulk Settings Change Application

## What does this app do?
This app is designed to apply a settings 2.0 configuration to a collection of entities all at once as a bulk change.
## How do I use it?

### 1. Entity Selector

Provide an entity selector string that returns the entities you want to change the settings for. Click preview to lock in your entity selector and to ensure that you have selected to correct entities.

### 2. Schema

Select the schema for the setting that you want to change for the entities selected. You can see the schema for a particular setting by either looking in the URL (starts with "builtin"). Or you can click the ... in the upper right corner of the settings page to see the schema info.

**insert screenshot of schema info button menu**

![click on schema info]()

![schema info]()

### 3. values

To find the values, click on the Dots in the top right corner of your setting and select "API". 

![Click on API]()

![API values]()

From the pre-generated API call, grab the values object only. This is what is used in the app.

Example:
\`\`\`json
{
	"enabled":true,
	"alertingMode":"ON_PGI_UNAVAILABILITY"
}
\`\`\`
## Example Use Case

For this example we will be turning on process group availability anomaly detection for all process groups with the tag **K8s Namespace: easytrade**.

Entity Selector: *type(PROCESS_GROUP),tag(K8s Namespace:easytrade)*

Schema: *builtin:availability.process-group-alerting*

Value: 
\`\`\`json
{
	"enabled":true,
	"alertingMode":"ON_PGI_UNAVAILABILITY"
}
\`\`\`

![All Fields Set]()
`;

export const Guide = () => {
    return (
        
        <><Button as={Link} to="/" variant='emphasized'>
            <ChevronLeftIcon />
            Back
        </Button>
        <Markdown>{guide}</Markdown></>
    );
};
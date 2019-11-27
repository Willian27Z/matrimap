import { FormlyFieldConfig } from '@ngx-formly/core';

export function getProfileForm () : FormlyFieldConfig[] {
    return [
        {
            "key": "firstName",
            "type": "input",
            "templateOptions": {
                "label": "Prénom"
            }
        },
        {
            "key": "lastName",
            "type": "input",
            "templateOptions": {
                "label": "Nom"
            }
        },
        {
            "key": "age",
            type: 'input',
            templateOptions: {
                type: 'number',
                label: 'Age',
                required: true,
            }
        },
        {
            "key": "genre",
            "type": "radio",
            "templateOptions": {
                "label": "Genre",
                "options": [
                    {
                        "label": "Male",
                        "value": "Male"
                    },
                    {
                        "label": "Female",
                        "value": "Female"
                    }
                ]
            }
        },
        {
            "key": "address",
            "type": "input",
            "templateOptions": {
                "label": "Coordonnées"
            }
        },
        {
            "key": "avatar",
            "type": "input",
            "templateOptions": {
                "label": "Image Profil (url)"
            }
        },
        {
            "key": "presentation",
            "type": "textarea",
            "templateOptions": {
                "label": "Description",
                "description": "Parlez un peu de vous..."
            }
        }
    ];
}

export function GetPrefs() : FormlyFieldConfig[] {
    return [
        {
            "key": "privateMessage",
            "type": "checkbox",
            templateOptions: {
                label: 'Nouveau message privé',
            }
        },
        {
            "key": "newScrapbookPost",
            "type": "checkbox",
            "templateOptions": {
              "label": "Nouveau message public"
            }
        },
        {
            "key": "friendRecommendation",
            "type": "checkbox",
            "templateOptions": {
              "label": "Recommandation d'amis"
            }
        },
        {
            "key": "discussionInvitation",
            "type": "checkbox",
            "templateOptions": {
              "label": "Invitation à une discussion"
            }
        },
        {
            "key": "friendRequest",
            "type": "checkbox",
            "templateOptions": {
              "label": "Nouvelle demande d'amis"
            }
        },
    ]
}
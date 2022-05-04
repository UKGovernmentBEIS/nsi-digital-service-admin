const OPTIONS = {
  cyaH1: "Check your answers before submitting notification",
  cyaH1Incomplete: "Check your answers and Submit Notification",
  sectors: {
    ACADEMICRESEARCHANDDEVELOPMENTINHIGHEREDUCATION:
      "Academic research and development in higher education",
    ACCOMMODATIONANDFOODSERVICEACTIVITIES:
      "Accommodation and food service activities",
    ADVANCEDMATERIALS: "Advanced materials",
    ADVANCEDROBOTICS: "Advanced robotics",
    ADMINISTRATIVEANDSUPPORTSERVICEACTIVITIES:
      "Administrative and support service activities",
    AGRICULTUREFORESTRYANDFISHING: "Agriculture, forestry and fishing",
    ARTIFICIALINTELLIGENCE: "Artificial intelligence",
    ARTSENTERTAINMENTANDRECREATION: "Arts, entertainment and recreation",
    CIVILNUCLEAR: "Civil nuclear",
    COMMUNICATIONS: "Communications",
    COMPUTINGHARDWARE: "Computing hardware",
    CONSTRUCTION: "Construction",
    CRITICALSUPPLIERSTOTHEEMERGENCYSERVICESSECTORS:
      "Critical suppliers to the emergency services sector",
    CRITICALSUPPLIERSTOTHEGOVERNMENT: "Critical suppliers to the government",
    CRYPTOGRAPHICAUTHENTICATION: "Cryptographic authentication",
    DATAINFRASTRUCTURE: "Data infrastructure",
    DEFENCE: "Defence",
    ENERGY: "Energy",
    ENGINEERINGBIOLOGY: "Engineering biology",
    FINANCIALANDINSURANCEACTIVITIES: "Financial and insurance activities",
    HUMANHEALTHANDSOCIALWORKACTIVITIES:
      "Human health and social work activities",
    INFORMATIONANDCOMMUNICATION: "Information and communication",
    MANUFACTURING: "Manufacturing",
    MILITARYANDDUALUSE: "Military and dual-use",
    MININGANDQUARRYING: "Mining and quarrying",
    OTHERSERVICEACTIVITIES: "Other service activities",
    PROFESSIONALSCIENTIFICANDTECHNICALACTIVITIES:
      "Professional, scientific and technical activities",
    PUBLICADMINISTRATIONANDDEFENCECOMPULSORYSOCIALSECURITY:
      "Public administration and defence; compulsory social security",
    QUANTUMTECHNOLOGIES: "Quantum technologies",
    REALESTATEACTIVITIES: "Real estate activities",
    SATELLITEANDSPACETECHNOLOGY: "Satellite and space technology",
    SUPPLIERSTOTHEEMERGENCYSERVICES: "Suppliers to the emergency services",
    SYNTHETICBIOLOGY: "Synthetic biology",
    TRANSPORT: "Transport",
    TRANSPORTATIONANDSTORAGELOGISTICS: "Transportation and storage (logistics)",
    WATERSUPPLYSEWERAGEWASTEMANAGEMENTANDREMEDIATIONACTIVITIES:
      "Water supply, sewerage, waste management and remediation activities",
    WHOLESALEANDRETAILTRADEADREPAIROFMOTORVEHICLESANDMOTORCYCLES:
      "Wholesale and retail trade, ad repair of motor vehicles and motorcycles",
  },

  triggerEvents: {
    SHAREPERCENT:
      "The percentage of the share that the person holds in the entity meets the relevant control thresholds.",
    VOTINGPERCENT:
      "The percentage of the voting rights that the person holds in the entity meets the relevant control thresholds.",
    PREVENTPASSAGE:
      "The acquisition of voting rights in the qualifying entity, whether alone or together with other voting rights held, will enable the acquirer to secure or prevent the passage of any class of resolution governing the affairs of the entity",
    ENABLEINFLUENCE:
      "The acquisition of a right or interest, alone or together with other interests or rights held, enable the acquirer to materially influence the policy of the qualifying entity?",
  },
  govDepartments: {
    ago: "Attorney general’s office",
    co: "Cabinet Office",
    beis: "Department for Business, Energy, and Industrial Strategy",
    dcms: "Department for Digital, Culture, Media & Sport",
    dfe: "Department for Education",
    dfefra: "Department for Environment Food & Rural Affairs",
    dit: "Department for International Trade",
    dft: "Department for Transport",
    dwp: "Department for Work and Pensions",
    dhsc: "Department of Health & Social Care",
    fcdo: "Foreign, Commonwealth and Development Office",
    hmt: "HM Treasury",
    ho: "Home Office",
    mod: "Ministry of Defence",
    mhclg: "Ministry of Housing, Communities & Local Government",
    moj: "Ministry of Justice",
    nio: "Northern Ireland Office",
    ootadfs: "Office of the Advocate General for Scotland",
    ootlhc: "Office of the Leader of the House of Commons",
    ootlhl: "Office of the Leader of the House of Lords",
    ootsss: "Office of the Secretary of State for Scotland",
    ootssw: "Office of the Secretary of State for Wales",
    ukef: "UK Export Finance",
    other: "Other",
  },
  multipleChoice: {
    Dontknow: "To the best of your knowledge",
    DoNotKnow: "Do not know",
    Yes: "Yes",
    No: "No",
    YES: "Yes",
    NO: "No",
  },
  RadioYesNo: [
    { text: "Yes", value: "Yes" },
    { text: "No", value: "No" },
  ],
  classificationLevels: [
    { label: "Official", val: "official" },
    { label: "Secret", val: "secret" },
    { label: "Top Secret", val: "top_secret" },
    { label: "Other", val: "other" },
  ],
  statusMappings: {
    1: "In Progress",
    2: "Submitted",
    3: "Submitted",
    4: "Accepted",
    5: "Rejected",
    6: "Submitted",
    7: "Request for Information",
  },
  notificationTypeMappings: {
    mandatory: "Mandatory",
    retrospective: "Retrospective",
    voluntary: "Voluntary",
  },
  cyaLabels: {
    mandatory: {
      q1iAcquirerOrRepresentative:
        "Are you the acquirer or a representative of the acquirer?",
      q1iiAcquirerFullname: "Name of acquirer",
      q1iiAcquirerBusinessaddress: "Business address of acquirer",
      q1iiAcquirerIndividual: "Your full name",
      q1iiAcquirerPosition: "Your position",
      q1iiAcquirerEmail: "Your email",
      q1iiAcquirerTelephone: "Your telephone",
      q1iiAuthorised:
        "Are you authorised to accept all correspondence about this notification?",
      q1iiAuthorisedName: "Full name of authorised person",
      q1iiAuthorisedPosition: "Position",
      q1iiAuthorisedEmail: "Email",
      q1iiAuthorisedTelephone: "Telephone",
      q1iiiAcquiringPartyName: "Name of acquirer",
      q1iiiAcquiringPartyIndividual:
        "Full name of person within acquirer we can contact if needed",
      q1iiiAcquiringPartyEmail:
        "Email of person within acquirer we can contact if needed",
      q1iiiAcquiringPartyTelephone:
        "Telephone of person within acquirer we can contact if needed",
      q1iiiRepresentatives: "Name of representative",
      q1iiiAuthorisedIndividual:
        "Full name of authorised individual from representative",
      q1iiiRepresentativeEmail: "Email of authorised individual",
      q1iiiRepresentativePhone: "Telephone of authorised individual",
      q1iiiRelationship: "Relationship to acquirer",
      q1ivAdditionalAcquirer:
        "Is there more than one acquirer involved in this acquisition?",
      q1ivaMultinotifiername: "Name of acquirer",
      q1ivaMultinotifierindividualname:
        "Full name of authorised individual from acquirer",
      q1ivaMultinotifierRepresentative:
        "Name of authorised representatives for acquiring party",
      q1ivaMultinotifierPercentage:
        "Expected or proposed percentage of ownership to be held in the qualifying entity following the acquisition",
      q1ivaMultinotifierAddress: "Business address of acquirer",
      q1ivaMultinotifierPhone: "Telephone of acquirer",
      q1ivaMultinotifierEmail: "Email of authorised individual",
      q2iSubmitTwelve:
        "To the best of your knowledge, has the acquirer submitted a notification to any overseas investment screening regimes within the last 12 months?",
      q2iCaseReference: "Case reference",
      q2iiSubmitTwelve:
        "Has the notifying party submitted a notification to any overseas investment screening regimes within the last 12 months?",
      q2iiAdditionalInfo: "Additional information",
      q3iiReason: "Reason",
      question3iiiPercent: 'Which "trigger event" applies to the acquisition?',
      question3iiiDetailsPercentageShare: "additional information",
      question3iiiDetailsPercentageVoting: "additional information",
      question3iiiDetailsPreventPassage: "additional information",
      question3iiiPercentResolutionTriggerDetails: "additional information",
      question3ivAcquisitionDetails:
        "Describe the acquisition and provide detail on the voting rights being acquired",
      question3vAcquisition:
        "Will the acquisition of voting rights in the qualifying entity (whether alone or together with other voting rights held by the person) enable the acquirer to secure or prevent the passage of any class of resolution governing the affairs of the entity?",
      question3vAcquisitionDetails:
        "Briefly describe the acquisition and provide detail on the voting rights",
      q4iAdditionalInfo: "Additional information",
      q4iiRegulatoryApproval:
        "To the best of your knowledge, will the acquisition require approval from any UK regulators?",
      q4ibRegulatorName: "Name of regulator",
      q4ibRegulatoryApprovalDate: "Date",
      q4ibAdditionalInfo: "Additional information",
      q4iiiOtherKeyDates:
        "Are there any other key dates you consider relevant to this notification?",
      q4icAdditionalKeyDates: "Additional key dates",
      question4icKeyDate: "Key date",
      question4icShortDescription: "Why this date is relevant",
      q5iNameQualifyingEntity: "Name of qualifying entity",
      q5iBusinessAddress: "Business address of qualifying entity",
      q5iWebsite: "Website",
      q5iDescription: "Description",
      q5iNameIndividualQualifyingEntity: "Full name",
      q5iEmail: "Email",
      q5iTelephone: "Telephone",
      q5iCompaniesHouse: "Companies House registration number",
      q5iSIC: "Standard industrial classification (SIC) code",
      q5iCountry: "Country of incorporation",
      q5iRegistration:
        "Full registration details within country of incorporation",
      q5iActivities:
        "Does the qualifying entity carry out activities in, or supply goods or services to, the UK?",
      q5iActivitiesDescription: "Describe UK activities, goods and services",
      q5iiIsAuthorised:
        "To the best of your knowledge, is the qualifying entity authorised to receive or hold information that has a UK Government Security Classification?",
      q5iiaHighestClassification: "Classification level",
      q5iiaDepartment:
        "Which government department or organisation does the information come from?",
      q5iiaOther: "Name of other government department, agency or public body",
      q5iiaDescription: "Description of information received or held",
      q5iiiIsLicenseRequired:
        "To the best of your knowledge, does the qualifying entity hold any licences to operate within its sector in the UK?",
      q5iiiaLicence: "Name of licence",
      q5iiiaIsApplicationSuccessful: "Was the application successful?",
      q5iiiaIssuer: "Name of issuer or regulator",
      q5iiiaIssueDate: "Date issued",
      q5ivIsDualUse:
        "To the best of your knowledge, does the qualifying entity hold or own any dual-use items?",
      q5ivaItemName: "Name of item",
      q5ivaDescription: "Description",
      q5vIsPartyTo:
        "To the best of your knowledge, in the last 5 years has the qualifying entity had a supply relationship with the UK government in any of the following areas?",
      q5vaSupplyRelationship: "Description of supply relationship",
      q5vaArea: "Area",
      q5vaDepartment: "UK government department, agency or public body",
      q5vaEntity: "Commercial entity or organisation",
      q5viIsFundedResearch:
        "To the best of your knowledge, in the last 5 years has the qualifying entity entered into any research and development that has been jointly or wholly funded by the UK government in the following areas?",
      q5viaName: "Name of research and development project",
      q5viaArea: "Area",
      q5viaDescription:
        "Description of the research and development undertaken",
      q5viaDepartment:
        "UK government department, agency or public body that funded the research and development",
      q5viaEntity:
        "Commercial entities or organisations who funded the research and development",
      q5viiIsNSVSC:
        "To the best of your knowledge, is the qualifying entity currently party to any contracts that require personnel to hold National Security Vetting (NSV) clearance?",
      q5viiaLevel: "Level of NSV security clearance",
      q5viiaHowMany: "Number of personnel with this level of clearance",
      q6iPreAcquisitionChartFileName: "File name",
      q6iiPostAcquisitionChartFileName: "File name",
      q6iiiNonUKGovt:
        "To the best of your knowledge, does any non-UK government have a direct or indirect role in the operation or decision making of the qualifying entity?",
      q6vAdditionalInformation: "Additional information",
      q6iiiNonUKGovernmentName: "Name of non-UK government or representative",
      q6iiiGovernmentInterest: "Describe its role and interests",
      q7iNameOfAcquirer: "Name of acquirer",
      q7iCountryOfOrigin: "Country of incorporation or nationality",
      q7iEntityOrIndividual: "Is the acquirer an entity or an individual?",
      q7iCompaniesHouseReference: "Companies House registration number",
      q7iSICReference: "Standard industrial classification (SIC) code",
      q7iIncorporatedOutsideUk: "Is entity incorporated outside the UK?",
      q7iRegistrationDetailsCountryOfCorporation:
        "Full registration details within country of incorporation",
      q7iDescriptionProductActivities:
        "Describe the acquirer's products, services and activities",
      q7iAcquirerAdditionalInformation: "Additional information",
      q7iiNonUKGovt:
        "To the best of your knowledge, does any non-UK government, or representative of any non-UK government, have share ownership or voting rights in the acquirer?",
      q7iiAdditionalInformation: "Additional information",
      q7iiNameOfNonUKGoverment: "Name of non-UK government or representative",
      q7iiNameOfPersonActingNonUKGoverment:
        "Name of person or entity acting on behalf of non-UK government",
      q7iiShareOwnershipVotingRights:
        "Percentage of share ownership or voting rights it holds",
      q7iiAnythingToDeclare:
        "Any other information that you consider relevant (optional)",
      q7iiiNonUKGovt:
        "To the best of your knowledge, does any non-UK government have a direct or indirect role in the operation or decision making of the acquirer?",
      q7iiiNameOfNonUKGoverment: "Name of non-UK government",
      q7iiiBriefInterestDescription: "Description of the role",
      q7ivContractualArrangements:
        "To the best of your knowledge, when the acquisition completes, will there be any contractual arrangements in place regarding share ownership or voting rights between the acquirer and any other party?",
      q7ivContractualArrangementsSummary:
        "Summary of the contractual arrangements",
      q8iControllingOwnershipFileName: "File name",
      q8iiNameOfBoardMember: "Full name",
      q8iiDateOfBirth: "Date of birth",
      q8iiPositionHeld: "Position held",
      q8iiClassifiedPolitically:
        "Is this person classified as a Politically Exposed Person (PEP) or similar?",
      fileuploadAdditionalDocumentation1Name: "File name",
      fileuploadAdditionalDocumentation2Name: "File name",
      fileuploadAdditionalDocumentation3Name: "File name",
      fileuploadAdditionalDocumentation4Name: "File name",
      q9iOtherComments: "Comments",
    },
    retrospective: {
      q10WhichType: "Which type of notifier are you?",
      q1iNotifyingPartyOrRepresentative:
        "Are you the notifier or a representative of the notifier?",
      q1iiNotifyingPartyName: "Name of notifier",
      q1iiNotifyingPartyBusinessaddress: "Business address of notifier",
      q1iiNotifyingPartyIndividual: "Your full name",
      q1iiNotifyingPartyPosition: "Your position",
      q1iiNotifyingPartyEmail: "Email",
      q1iiNotifyingPartyTelephone: "Telephone",
      q1iiAuthorised:
        "Are you authorised to accept all correspondence about this notification?",
      q1iiAuthorisedName: "Full name of authorised person",
      q1iiAuthorisedPosition: "Position",
      q1iiAuthorisedEmail: "Email",
      q1iiAuthorisedTelephone: "Telephone",
      q1iiiNotifyingPartyName: "Name of notifer",
      q1iiiNotifyingPartyIndividual:
        "Full name of person within notifier we can contact if needed",
      q1iiiNotifyingPartyEmail: "Email",
      q1iiiNotifyingPartyPhone: "Telephone",
      q1iiiRepresentatives: "Name of representative",
      q1iiiLeadRepresentatives: "Lead representatives",
      q1iiiAuthorisedIndividual:
        "Full name of authorised individual from representative",
      q1iiiRepresentativeEmail: "Email",
      q1iiiRepresentativePhone: "Telephone",
      q1iiiRelationship: "Relationship to notifier",
      q1iiiAuthorised:
        "Is this individual authorised to accept all correspondence and accept service?",
      q1ivAdditionalAcquirer:
        "Is there more than one acquirer involved in this acquisition?",
      q1ivaMultinotifiername: "Name of acquirer",
      q1ivaMultinotifierindividualname:
        "Full name of authorised individual from acquirer",
      q1ivaMultinotifierRepresentative:
        "Name of authorised representatives for acquiring party",
      q1ivaMultinotifierPercentage:
        "Expected or proposed percentage of ownership to be held in the qualifying entity following the acquisition",
      q1ivaMultinotifierAddress: "Business address of acquirer",
      q1ivaMultinotifierPhone: "Telephone of acquirer",
      q1ivaMultinotifierEmail: "Email of authorised individual",
      q2iSubmitTwelve:
        "Has a previous notification (whether mandatory, voluntary, or retrospective) involving the notifying party been submitted under the NSI Act within the last 12 months?",
      q2iCaseReference: "Case reference",
      q2iiSubmitTwelve:
        "To the best of your knowledge, has the notifier acquirer submitted a notification to any overseas investment screening regimes within the last 12 months?",
      q2iiAdditionalInfo: "Additional information",
      q30Reason: "Reason",
      q3iiReason: "Reason",
      q3iSector: "Which sectors are relevant to this notification?",
      q3iMoreInfo: "Additional information",
      question3iiiPercent: 'Which "trigger event" applies to the acquisition?',
      question3iiiDetailsPercentageShare: "additional information",
      question3iiiDetailsPercentageVoting: "additional information",
      question3iiiDetailsPreventPassage: "additional information",
      question3iiiPercentResolutionTriggerDetails: "additional information",
      question3ivAcquisitionDetails:
        "Describe the acquisition and provide detail on the voting rights being acquired",
      question3vAcquisition:
        "Will the acquisition of voting rights in the qualifying entity (whether alone or together with other voting rights held by the person) enable the acquirer to secure or prevent the passage of any class of resolution governing the affairs of the entity?",
      question3vAcquisitionDetails:
        "Briefly describe the acquisition and provide detail on the voting rights",
      q4iaquisitionDate: "Acquisition date",
      q4iAdditionalInfo: "Additional information",
      q4iiRegulatoryApproval:
        "To the best of your knowledge, will the acquisition require approval from any UK regulators?",
      q4ibRegulatorName: "Name of regulator",
      q4ibAdditionalInfo: "Additional information",
      q4iiiOtherKeyDates:
        "Are there any other key dates you consider relevant to this notification?",
      q4icAdditionalKeyDates: "Additional key dates",
      question4icKeyDate: "Key date",
      question4icShortDescription: "Why this date is relevant",
      q5iNameQualifyingEntity: "Name of qualifying entity",
      q5iBusinessAddress: "Business address of qualifying entity",
      q5iWebsite: "Website",
      q5iDescription: "Description",
      q5iNameIndividualQualifyingEntity: "Full name",
      q5iEmail: "Email",
      q5iTelephone: "Telephone",
      q5iCompaniesHouse: "Companies House registration number",
      q5iSIC: "Standard industrial classification (SIC) code",
      q5iCountry: "Country of incorporation",
      q5iRegistration:
        "Full registration details within country of incorporation",
      q5iActivities:
        "Does the qualifying entity carry out activities in, or supply goods or services to, the UK?",
      q5iActivitiesDescription:
        "Briefly describe the activities carried out in the UK or goods supplied or services supplied to the UK",
      q5iiIsAuthorised:
        "To the best of your knowledge, is the qualifying entity authorised to receive or hold information that has a UK Government Security Classification?",
      q5iiaHighestClassification: "Classification level",
      q5iiaDepartment:
        "Which government department or organisation does the information come from?",
      q5iiaOther: "Name of other government department, agency or public body",
      q5iiaDescription: "Description of information received or held",
      q5iiiIsLicenseRequired:
        "To the best of your knowledge, does the qualifying entity hold any licences to operate within its sector in the UK?",
      q5iiiaLicence: "Name of licence",
      q5iiiaIsApplicationSuccessful: "Was the application successful?",
      q5iiiaIssuer: "Name of issuer or regulator",
      q5iiiaIssueDate: "Date issued",
      q5ivIsDualUse:
        "To the best of your knowledge, does the qualifying entity hold or own any dual-use items?",
      q5ivaItemName: "Name of item",
      q5ivaDescription: "Description",
      q5vIsPartyTo:
        "To the best of your knowledge, in the last 5 years has the qualifying entity had a supply relationship with the UK government in any of the following areas?",
      q5vaSupplyRelationship: "Description of supply relationship",
      q5vaArea: "Area",
      q5vaDepartment: "UK government department, agency or public body",
      q5vaEntity: "Commercial entity or organisation",
      q5viIsFundedResearch:
        "To the best of your knowledge, in the last 5 years has the qualifying entity entered into any research and development that has been jointly or wholly funded by the UK government in the following areas?",
      q5viaName: "Name of research and development project",
      q5viaArea: "Area",
      q5viaDescription:
        "Description of the research and development undertaken",
      q5viaDepartment:
        "UK government department, agency or public body that funded the research and development",
      q5viaEntity:
        "Commercial entities or organisations who funded the research and development",
      q5viiIsNSVSC:
        "To the best of your knowledge, is the qualifying entity currently party to any contracts that require personnel to hold National Security Vetting (NSV) clearance?",
      q5viiaLevel: "Level of NSV security clearance",
      q5viiaHowMany: "Number of personnel with this level of clearance",
      q6iPreAcquisitionChartFileName: "File name",
      q6iiPostAcquisitionChartFileName: "File name",
      q6iiiNonUKGovt:
        "To the best of your knowledge, does any non-UK government have a direct or indirect role in the operation or decision making of the qualifying entity?",
      q6vAdditionalInformation: "Additional information",
      q6iiiNonUKGovernmentName: "Name of non-UK government or representative",
      q6iiiGovernmentInterest: "Describe its role and interests",
      q7iNameOfAcquirer: "Name of acquirer",
      q7iCountryOfOrigin: "Country of incorporation or nationality",
      q7iEntityOrIndividual: "Is the acquirer an entity or an individual?",
      q7iCompaniesHouseReference: "Companies House registration number",
      q7iSICReference: "Standard industrial classification (SIC) code",
      q7iIncorporatedOutsideUk: "Is entity incorporated outside the UK?",
      q7iRegistrationDetailsCountryOfCorporation:
        "Full registration details within country of incorporation",
      q7iDescriptionProductActivities:
        "Describe the acquirer's products, services and activities",
      q7iAcquirerAdditionalInformation: "Additional information",
      q7iiNonUKGovt:
        "To the best of your knowledge, does any non-UK government, or representative of any non-UK government, have share ownership or voting rights in the acquirer?",
      q7iiNameOfNonUKGoverment: "Name of non-UK government or representative",
      q7iiNameOfPersonActingNonUKGoverment:
        "Name of person or entity acting on behalf of non-UK government",
      q7iiShareOwnershipVotingRights:
        "Percentage of share ownership or voting rights it holds",
      q7iiAnythingToDeclare:
        "Any other information that you consider relevant (optional)",
      q7iiiNonUKGovt:
        "To the best of your knowledge, does any non-UK government have a direct or indirect role in the operation or decision making of the acquirer?",
      q7iiiNameOfNonUKGoverment: "Name of non-UK government",
      q7iiiBriefInterestDescription: "Description of the role",
      q7ivContractualArrangements:
        "To the best of your knowledge, when the acquisition completes, will there be any contractual arrangements in place regarding share ownership or voting rights between the acquirer and any other party?",
      q7ivContractualArrangementsSummary:
        "Summary of the contractual arrangements",
      q8iControllingOwnershipFileName: "File name",
      q8iiNameOfBoardMember: "Full name",
      q8iiDateOfBirth: "Date of birth",
      q8iiPositionHeld: "Position held",
      q8iiClassifiedPolitically:
        "Is this person classified as a Politically Exposed Person (PEP) or similar?",
      fileuploadAdditionalDocumentation1Name: "File name",
      fileuploadAdditionalDocumentation2Name: "File name",
      fileuploadAdditionalDocumentation3Name: "File name",
      fileuploadAdditionalDocumentation4Name: "File name",
      q9iOtherComments: "Comments",
    },
    voluntary: {
      q10WhichType: "Which type of notifier are you?",
      q1iNotifyingPartyOrRepresentative:
        "Are you the notifier or a representative of the notifier?",
      q1iiNotifyingPartyName: "Name of notifier",
      q1iiNotifyingPartyBusinessaddress: "Business address of notifier",
      q1iiNotifyingPartyIndividual: "Your full name",
      q1iiNotifyingPartyPosition: "Your position",
      q1iiNotifyingPartyEmail: "Email",
      q1iiNotifyingPartyTelephone: "Telephone",
      q1iiAuthorised:
        "Are you authorised to accept all correspondence about this notification?",
      q1iiAuthorisedName: "Full name of authorised person",
      q1iiAuthorisedPosition: "Position",
      q1iiAuthorisedEmail: "Email",
      q1iiAuthorisedTelephone: "Telephone",
      q1iiiNotifyingPartyName: "Name of notifer",
      q1iiiNotifyingPartyIndividual:
        "Full name of person within notifier we can contact if needed",
      q1iiiNotifyingPartyEmail: "Email",
      q1iiiNotifyingPartyPhone: "Telephone",
      q1iiiRepresentatives: "Name of representative",
      q1iiiLeadRepresentatives: "Lead representatives",
      q1iiiAuthorisedIndividual:
        "Full name of authorised individual from representative",
      q1iiiRepresentativeEmail: "Email",
      q1iiiRepresentativePhone: "Telephone",
      q1iiiRelationship: "Relationship to notifier",
      q1iiiAuthorised:
        "Is this individual authorised to accept all correspondence and accept service?",
      q1ivAdditionalAcquirer:
        "Is there more than one acquirer involved in this acquisition?",
      q1ivaMultinotifiername: "Name of acquirer",
      q1ivaMultinotifierindividualname:
        "Full name of authorised individual from acquirer",
      q1ivaMultinotifierRepresentative:
        "Name of authorised representatives for acquiring party",
      q1ivaMultinotifierPercentage:
        "Expected or proposed percentage of ownership to be held in the qualifying entity following the acquisition",
      q1ivaMultinotifierAddress: "Business address of acquirer",
      q1ivaMultinotifierPhone: "Telephone of acquirer",
      q1ivaMultinotifierEmail: "Email of authorised individual",
      q1vPreviousNotification: "Previous notification",
      q1vPreviousNotificationRef: "Reference",
      q2iSubmitTwelve:
        "Has a previous notification (whether mandatory, voluntary, or retrospective) involving the notifying party been submitted under the NSI Act within the last 12 months?",
      q2iCaseReference: "Case reference",
      q2iiSubmitTwelve:
        "To the best of your knowledge, has the notifier acquirer submitted a notification to any overseas investment screening regimes within the last 12 months?",
      q2iiAdditionalInfo: "Additional information",
      q3iaAcquisitionInContemplationOrTakenPlace:
        "At what stage is the acquisition?",
      q3iiReason: "Additional information",
      q3iiQualifyingAssetOrQualifyingEntity: "What are you notifying about?",
      question32aQualifyingEntity:
        "Will the acquisition provide the ability for the acquirer to use, control or direct the asset?",
      question32aQualifyingEntityDetails: "Details",
      q3iSector: "Which sectors are relevant to this notification?",
      q3iMoreInfo: "Describe the acquirer's activities within these sectors",
      question3iiiPercent: 'Which "trigger event" applies to the acquisition?',
      question3iiiDetailsPercentageShare: "additional information",
      question3iiiDetailsPercentageVoting: "additional information",
      question3iiiDetailsPreventPassage: "additional information",
      question3iiiDetailsEnableInfluence: "additional information",
      question3iiiPercentResolutionTriggerDetails: "additional information",
      question3ivAcquisitionDetails:
        "Describe the acquisition and provide detail on the voting rights being acquired",
      question3ivMaterialInfluence:
        "Does the acquisition of a right or interest, alone or together with other interests or rights held, enable the acquirer to materially influence the policy of the qualifying entity?",
      question3vAcquisition:
        "Will the acquisition of voting rights in the qualifying entity (whether alone or together with other voting rights held by the person) enable the acquirer to secure or prevent the passage of any class of resolution governing the affairs of the entity?",
      question3vAcquisitionDetails:
        "Briefly describe the acquisition and provide detail on the voting rights",
      question3ivMaterialInfluenceDetails: "Details",
      q4iaquisitionDate: "Acquisition date",
      q4iAdditionalInfo: "Additional information",
      q4iiRegulatoryApproval:
        "To the best of your knowledge, will the acquisition require approval from any UK regulators?",
      q4ibRegulatorName: "Name of regulator",
      q4ibAdditionalInfo: "Additional information",
      q4iiiOtherKeyDates:
        "Are there any other key dates you consider relevant to this notification?",
      q4icAdditionalKeyDates: "Additional key dates",
      question4icKeyDate: "Key date",
      question4icShortDescription: "Why this date is relevant",
      q5iNameQualifyingEntity: "Name of qualifying entity",
      q5iBusinessAddress: "Business address of qualifying entity",
      q5iWebsite: "Website",
      q5iDescription: "Description",
      q5iNameIndividualQualifyingEntity: "Full name",
      q5iEmail: "Email",
      q5iTelephone: "Telephone",
      q5iCompaniesHouse: "Companies House registration number",
      q5iSIC: "Standard industrial classification (SIC) code",
      q5iCountry: "Country of incorporation",
      q5iRegistration:
        "Full registration details within country of incorporation",
      q5iActivities:
        "Does the qualifying entity carry out activities in, or supply goods or services to, the UK?",
      q5iActivitiesDescription:
        "Briefly describe the activities carried out in the UK or goods supplied or services supplied to the UK",
      q5iiIsAuthorised:
        "To the best of your knowledge, is the qualifying entity authorised to receive or hold information that has a UK Government Security Classification?",
      q5iiaHighestClassification: "Classification level",
      q5iiaDepartment:
        "Which government department or organisation does the information come from?",
      q5iiaOther: "Name of other government department, agency or public body",
      q5iiaDescription: "Description of information received or held",
      q5iiiIsLicenseRequired:
        "To the best of your knowledge, does the qualifying entity hold any licences to operate within its sector in the UK?",
      q5iiiaLicence: "Name of licence",
      q5iiiaIsApplicationSuccessful: "Was the application successful?",
      q5iiiaIssuer: "Name of issuer or regulator",
      q5iiiaIssueDate: "Date issued",
      q5ivIsDualUse:
        "To the best of your knowledge, does the qualifying entity hold or own any dual-use items?",
      q5ivaItemName: "Name of item",
      q5ivaDescription: "Description",
      q5vIsPartyTo:
        "To the best of your knowledge, in the last 5 years has the qualifying entity had a supply relationship with the UK government in any of the following areas?",
      q5vaSupplyRelationship: "Description of supply relationship",
      q5vaArea: "Area",
      q5vaDepartment: "UK government department, agency or public body",
      q5vaEntity: "Commercial entity or organisation",
      q5viIsFundedResearch:
        "To the best of your knowledge, in the last 5 years has the qualifying entity entered into any research and development that has been jointly or wholly funded by the UK government in the following areas?",
      q5viaName: "Name of research and development project",
      q5viaArea: "Area",
      q5viaDescription:
        "Description of the research and development undertaken",
      q5viaDepartment:
        "UK government department, agency or public body that funded the research and development",
      q5viaEntity:
        "Commercial entities or organisations who funded the research and development",
      q5viiIsNSVSC:
        "To the best of your knowledge, is the qualifying entity currently party to any contracts that require personnel to hold National Security Vetting (NSV) clearance?",
      q5viiaLevel: "Level of NSV security clearance",
      q5viiaHowMany: "Number of personnel with this level of clearance",

      q5altiNameOfAsset: "Full name of asset",
      q5altiAssetType:
        "Which qualifying asset type does this notification relate to?",
      q5altiAddress: "Address of qualifying asset",
      q5altiDescription: "Description the qualifying asset",
      q5altiAdditionalInfo: "Additional information",
      q5altiiIsAuthorised:
        "To the best of your knowledge, does the qualifying asset have a UK government Security Classification?",
      q5altiiaHighestClassification:
        "What is the qualifying asset's highest Security Classification level?",
      q5altiiaDepartment:
        "Which government department, agency or public body does the information come from?",
      q5altiiaOther:
        "Name of other government department, agency or public body",
      q5altiiaDescription:
        'Description of why the qualifying asset has a UK government Security Classification"',
      q5altiiaAdditionalInfo: "Additional information",
      q5altiiiIsLicenseRequired:
        "To the best of your knowledge, does the qualifying asset hold any licences to operate within its sector in the UK?",
      q5altiiiaLicence: "Name of licence",
      q5altiiiaIsApplicationSuccessful:
        "Application successful or unsuccessful?",
      q5altiiiaIssuer: "Name of issuer or regulator",
      q5altiiiaIssueDate: "Date issued",
      q5altivIsDualUse:
        "To the best of your knowledge, is the qualifying asset considered to be a dual-use item?",
      q5altivaItemName: "Name of asset that is considered a dual-use item",
      q5altivaDescription: "Description of dual-use item and its application",
      q5altvData:
        "To the best of your knowledge, is the qualifying asset used to gather or hold data on UK citizens?",
      q5altvDescription: "Describe the data gathered or held",
      q5altviData:
        "Does the qualifying asset hold any UK or internationally recognised standards, accreditations or certifications relevant to the sectors covered by this notification?",
      q5altviName:
        "Names of the standards, accreditations or certifications held",
      q5altviAdditionalInfo: "Additional information",

      q6iPreAcquisitionChartFileName: "File name",
      q6iPreAcquisitionChartFileNameAsset: "File name",
      q6iiPostAcquisitionChartFileName: "File name",
      q6iiPostAcquisitionChartFileNameAsset: "File name",
      q6iiiNonUKGovt:
        "To the best of your knowledge, does any non-UK government have a direct or indirect role in the operation or decision making of the qualifying entity?",
      q6vAdditionalInformation: "Additional information",
      q6iiiNonUKGovernmentName: "Name of non-UK government or representative",
      q6iiiGovernmentInterest: "Describe its role and interests",
      q6iiiContractualArrangementAsset:
        "To the best of your knowledge, does any non-UK government have a direct or indirect role in controlling how the qualifying asset is used?",
      q7iNameOfAcquirer: "Name of acquirer",
      q7iCountryOfOrigin: "Country of incorporation or nationality",
      q7iEntityOrIndividual: "Is the acquirer an entity or an individual?",
      q7iCompaniesHouseReference: "Companies House registration number",
      q7iSICReference: "Standard industrial classification (SIC) code",
      q7iIncorporatedOutsideUk: "Is entity incorporated outside the UK?",
      q7iRegistrationDetailsCountryOfCorporation:
        "Full registration details within country of incorporation",
      q7iDescriptionProductActivities:
        "Describe the acquirer's products, services and activities",
      q7iAcquirerAdditionalInformation: "Additional information",
      q7iiNonUKGovt:
        "To the best of your knowledge, does any non-UK government, or representative of any non-UK government, have share ownership or voting rights in the acquirer?",
      q7iiNameOfNonUKGoverment: "Name of non-UK government or representative",
      q7iiNameOfPersonActingNonUKGoverment:
        "Name of person or entity acting on behalf of non-UK government",
      q7iiShareOwnershipVotingRights:
        "Percentage of share ownership or voting rights it holds",
      q7iiAnythingToDeclare:
        "Any other information that you consider relevant (optional)",
      q7iiiNonUKGovt:
        "To the best of your knowledge, does any non-UK government have a direct or indirect role in the operation or decision making of the acquirer?",
      q7iiiNameOfNonUKGoverment: "Name of non-UK government",
      q7iiiBriefInterestDescription: "Description of the role",
      q7ivContractualArrangements:
        "To the best of your knowledge, when the acquisition completes, will there be any contractual arrangements in place regarding share ownership or voting rights between the acquirer and any other party?",
      q7ivContractualArrangementsSummary:
        "Summary of the contractual arrangements",
      q8iControllingOwnershipFileName: "File name",
      q8iiNameOfBoardMember: "Full name",
      q8iiDateOfBirth: "Date of birth",
      q8iiPositionHeld: "Position held",
      q8iiClassifiedPolitically:
        "Is this person classified as a Politically Exposed Person (PEP) or similar?",
      fileuploadAdditionalDocumentation1Name: "File name",
      fileuploadAdditionalDocumentation2Name: "File name",
      fileuploadAdditionalDocumentation3Name: "File name",
      fileuploadAdditionalDocumentation4Name: "File name",
      q9iOtherComments: "Comments",
    },
  },
};

OPTIONS.govDepartmentsFmt = Object.getOwnPropertyNames(
  OPTIONS.govDepartments
).map((g) => ({
  label: OPTIONS.govDepartments[g],
  val: g,
}));

OPTIONS.valueMappings = {
  ...OPTIONS.triggerEvents,
  ...OPTIONS.govDepartments,
  ...OPTIONS.multipleChoice,
  notifyingParty: "Notifying Party",
  representative: "Representative",
  qualifyingAsset: "Qualifying Asset",
  QualifyingAsset: "Qualifying Asset",
  qualifyingEntity: "Qualifying Entity",
  QualifyingEntity: "Qualifying Entity",
  inContemplation: "In Contemplation",
  takenPlace: "Taken place",
  entity: "Entity",
  individual: "Individual",
};

module.exports = OPTIONS;

const value = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
};

export const initialData = {
    startMonth: 'January',
    endMonth: 'December',
    items: [
        {
            name: 'Income',
            values: { ...value },
            children: [
                {
                    name: 'General Income',
                    values: { ...value },
                    children: [
                        {
                            name: 'Sales',
                            values: { ...value },
                            children: []
                        },
                        {
                            name: 'Commission',
                            values: { ...value },
                            children: []
                        },
                        {
                            name: "Add a new 'General Income' Category",
                            values: {},
                            children: [],
                        },
                    ]
                },

                {
                    name: 'Sub Totals',
                    values: { ...value },  // Added to initialize Sub Totals
                },
                {
                    name: 'Salary',
                    values: { ...value },
                    children: []
                },
                {
                    name: 'Bonus',
                    values: { ...value },
                    children: []
                }
            ]

        },

        {
            name: 'Expenses',
            values: { ...value },
            children: [
                {
                    name: 'Rent',
                    values: { ...value },
                    children: []
                },
                {
                    name: 'Utilities',
                    values: { ...value },
                    children: []
                }]
        }
    ]
};

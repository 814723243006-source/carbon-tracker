# 🌍 Carbon Tracker

A comprehensive web application to help you track, monitor, and reduce your carbon footprint across various daily activities.

## 📋 Features

### Core Functionality

- **📊 Dashboard**: View your total carbon emissions with visual breakdowns by category and time-based trends
- **✏️ Emission Logging**: Log emissions across four main categories:
  - 🚗 **Transportation** (car, bus, train, flights)
  - ⚡ **Home Energy** (electricity, natural gas, heating oil)
  - 🍽️ **Food & Diet** (meat, dairy, vegetarian, vegan meals)
  - 🛍️ **Shopping & Goods** (clothing, electronics, furniture)
- **📈 History & Trends**: View historical emission data with interactive charts showing daily, weekly, monthly, and yearly views
- **🎯 Goals & Targets**: Set carbon reduction goals and track your progress toward them
- **💡 Tips & Recommendations**: Get personalized, actionable suggestions based on your emission patterns

### Technical Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Persistence**: All data stored locally using browser localStorage
- **Interactive Charts**: Powered by Chart.js for beautiful data visualization
- **Clean UI**: Green/earth-tone color scheme perfect for an environmental app
- **No Backend Required**: Fully client-side application

## 🚀 How to Run

1. **Clone or download this repository**
2. **Open `index.html` in your web browser**
   - Simply double-click the file, or
   - Right-click and select "Open with" → Your preferred browser
3. **Start tracking your carbon footprint!**

That's it! No installation, no build process, no server required.

## 📱 Usage Guide

### Getting Started

1. **Dashboard**: When you first open the app, you'll see the dashboard with sample data
2. **Log Emissions**: Click "Log Emissions" in the navigation to add your activities
3. **View History**: Check the "History" tab to see all your logged emissions
4. **Set Goals**: Navigate to "Goals" to create carbon reduction targets
5. **Get Tips**: Visit the "Tips" section for personalized recommendations

### Logging an Emission

1. Select a category (Transportation, Energy, Food, or Shopping)
2. Choose the specific activity type
3. Enter the amount (the unit will be shown based on your selection)
4. Select the date
5. Optionally add a description
6. Click "Log Emission"

### Creating a Goal

1. Go to the "Goals" tab
2. Either select a suggested goal or create a custom one
3. Enter a title, target emissions amount, and time period
4. Track your progress on the goals page

## 🔢 Emission Factors

The application uses the following standard emission factors for calculations:

### Transportation (kg CO2e per km)
- Car (Gasoline): 0.21
- Bus: 0.089
- Train: 0.041
- Flight (Domestic): 0.255
- Flight (International): 0.195

### Home Energy
- Electricity: 0.42 kg CO2e per kWh (US average)
- Natural Gas: 2.0 kg CO2e per m³
- Heating Oil: 2.68 kg CO2e per L

### Food & Diet (kg CO2e per meal)
- Beef Meal: 6.61
- Chicken Meal: 1.82
- Pork Meal: 2.45
- Fish Meal: 1.35
- Vegetarian Meal: 0.51
- Vegan Meal: 0.39

### Shopping & Goods (kg CO2e per item)
- Clothing: 10.0
- Electronics: 50.0
- Furniture: 100.0
- General Purchase: 5.0

## 📂 Project Structure

```
carbon-tracker/
├── index.html              # Main HTML page
├── css/
│   └── styles.css         # Application styles
├── js/
│   ├── app.js             # Main application logic and UI controllers
│   ├── emissions.js       # Emission calculation engine and factors
│   ├── storage.js         # localStorage data persistence layer
│   ├── goals.js           # Goals tracking system
│   ├── tips.js            # Tips and recommendations engine
│   └── charts.js          # Chart.js visualization logic
└── README.md              # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Vanilla JavaScript for all functionality
- **Chart.js**: Data visualization library
- **localStorage API**: Client-side data persistence

## 🌱 Environmental Impact

By using Carbon Tracker, you can:
- Become more aware of your daily carbon emissions
- Identify the biggest sources of your carbon footprint
- Track your progress over time
- Make informed decisions to reduce your environmental impact
- Set and achieve meaningful reduction goals

## 📊 Data Privacy

All your data is stored locally in your browser using localStorage. No data is sent to any server or third party. Your carbon footprint data stays completely private on your device.

## 🎨 Design Philosophy

The application uses a green and earth-tone color scheme to reflect its environmental focus:
- Primary Green: #4CAF50
- Dark Green: #2E7D32
- Earth Brown: #6D4C41
- Sky Blue: #4FC3F7

The design is clean, modern, and intuitive, making it easy for anyone to start tracking their carbon footprint.

## 🔮 Future Enhancements

Potential features for future versions:
- Export data to CSV/PDF
- Comparison with national/global averages
- Social sharing of achievements
- More detailed emission factors by region
- Carbon offset calculator
- Integration with smart home devices

## 📖 References

Emission factors are based on:
- US Environmental Protection Agency (EPA)
- UK Government GHG Conversion Factors
- Various peer-reviewed scientific studies on lifecycle emissions

## 📄 License

This project is open source and available for educational and personal use.

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Add more emission categories
- Implement data export functionality
- Create more visualization options
- Add multilingual support
- Improve emission factor accuracy for specific regions

---

**Start tracking your carbon footprint today and join the fight against climate change! 🌍💚**
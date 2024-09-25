import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importing Picker for Dropdown
import Autocomplete from 'react-native-autocomplete-input'; // Importing Autocomplete for search suggestions

const FreeListingScreen = () => {
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [contacts, setContacts] = useState([{ type: 'Mobile No', value: '' }]);

  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch('http://localhost:3000/view');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);

      // Fetch cities
      const citiesResponse = await fetch('http://localhost:3000/cities');
      const citiesData = await citiesResponse.json();
      setCities(citiesData);

      // Fetch districts
      const districtsResponse = await fetch('http://localhost:3000/districts');
      const districtsData = await districtsResponse.json();
      setDistricts(districtsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data.');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle contact additions
  const handleAddContact = () => {
    setContacts([...contacts, { type: 'Mobile No', value: '' }]);
  };

  const handleRemoveContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const handleContactChange = (index, key, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][key] = value;
    setContacts(updatedContacts);
  };

  // Filtering categories for search suggestions
  const handleCategoryChange = (text) => {
    setCategory(text);
    const filtered = categories.filter((cat) => cat.cate_name.toLowerCase().includes(text.toLowerCase()));
    setFilteredCategories(filtered);
  };

  // Function to handle form submission
  const handleSave = async () => {
    // Prepare form data
    const formData = {
      district,
      city,
      name,
      address,
      category,
      description,
      contacts,
    };

    try {
      const response = await fetch('http://localhost:3000/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Business information saved successfully.');
      } else {
        Alert.alert('Error', 'Failed to save business information.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  // Render contact input
  const renderContact = ({ item, index }) => (
    <View key={index} style={styles.contactContainer}>
      <View style={[styles.contactDropdown, styles.input]}>
        <Picker
          selectedValue={item.type}
          onValueChange={(value) => handleContactChange(index, 'type', value)}
          style={styles.picker}
        >
          <Picker.Item label="Mobile No" value="mobile_no" />
          <Picker.Item label="Land No" value="land_no" />
          <Picker.Item label="Website" value="web" />
          <Picker.Item label="Email" value="email" />
        </Picker>
      </View>
      <TextInput
        style={[styles.contactValueInput, styles.input]}
        placeholder="Value"
        value={item.value}
        onChangeText={(text) => handleContactChange(index, 'value', text)}
      />
      {index === 0 ? (
        <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveContact(index)}>
          <Text style={styles.removeButtonText}>-</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      data={contacts}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderContact}
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.title}>+Free listing</Text>
          <Text style={styles.subtitle}>Add your business</Text>

          {/* District Dropdown */}
          <Text style={styles.label}>District</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={district}
              onValueChange={(itemValue) => setDistrict(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select District" value="" />
              {districts.map((district, index) => (
                <Picker.Item key={index} label={district.district_name} value={district.district_id} />
              ))}
            </Picker>
          </View>

          {/* City Input */}
          <Text style={styles.label}>City</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={city}
              onValueChange={(itemValue) => setCity(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select City" value="" />
              {cities.map((city, index) => (
                <Picker.Item key={index} label={city.city_name} value={city.city_id} />
              ))}
            </Picker>
          </View>

          {/* Name Input */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your name"
            value={name}
            onChangeText={setName}
          />

          {/* Address Input */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your address"
            value={address}
            onChangeText={setAddress}
          />

          {/* Base Category Input with Search Suggestions */}
          <Text style={styles.label}>Base category</Text>
          <Autocomplete
            data={filteredCategories}
            defaultValue={category}
            onChangeText={handleCategoryChange}
            flatListProps={{
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => setCategory(item.cate_name)}>
                  <Text style={styles.itemText}>{item.cate_name}</Text>
                </TouchableOpacity>
              ),
            }}
            inputContainerStyle={styles.input}
            placeholder="Type to search..."
          />

          {/* Description Input */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Type here"
            value={description}
            multiline
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Contact</Text>
        </View>
      }
      ListFooterComponent={
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  // Same styles as before
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff5a00',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#add8e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    paddingHorizontal: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactDropdown: {
    flex: 0.4,
    height: 45,
  },
  contactValueInput: {
    flex: 0.6,
    marginLeft: 10,
    height: 45,
  },
  addButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 10,
  },
  addButtonText: {
    fontSize: 24,
    color: '#007bff',
  },
  removeButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 10,
  },
  removeButtonText: {
    fontSize: 24,
    color: '#ff0000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemText: {
    padding: 10,
    fontSize: 16,
    color: '#000',
  }
});

export default FreeListingScreen;

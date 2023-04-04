import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
} from 'react-native';

const UserList = () => {
  const [usersList, setUsersList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [saerchText, setSearchText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const repsone = await fetch('https://randomuser.me/api/?results=100');
      const json = await repsone.json();

      setUsersList(json?.results);
      setFilterData(json?.results);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('Error Fetching User List', error);
    }
  };

  const renderUserList = ({item, index}) => {
    return (
      <View style={styles.renderItemView}>
        <Image style={styles.userImage} source={{uri: item.picture.medium}} />
        <View style={styles.nameView}>
          <Text>First Name : {item.name.first}</Text>
          <Text>Last Name : {item.name.last}</Text>
        </View>
      </View>
    );
  };

  const onSearchChange = text => {
    if (text.trim()) {
      const newData = usersList?.filter(item => {
        if (item?.name?.first?.toLowerCase().includes(text.toLowerCase())) {
          return true;
        }
        if (item?.name?.last?.toLowerCase().includes(text.toLowerCase())) {
          return true;
        }
      });
      setFilterData(newData);
      setSearchText(text);
    } else {
      setFilterData(usersList);
      setSearchText(text);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <React.Fragment>
          <TextInput
            style={styles.inputStyle}
            placeholder="Search Here..."
            placeholderTextColor={'white'}
            value={saerchText}
            onChangeText={onSearchChange}
          />

          <FlatList
            style={styles.flListStyle}
            contentContainerStyle={styles.contentContainerStyle}
            data={filterData}
            keyExtractor={({item, index}) => index}
            renderItem={renderUserList}
          />
        </React.Fragment>
      )}
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  flListStyle: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: 20,
  },
  inputStyle: {
    height: 40,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
    padding: 0,
    backgroundColor: 'grey',
    paddingHorizontal: 20,
    color: 'white',
    borderRadius: 40,
  },
  userImage: {
    height: 70,
    width: 70,
    borderRadius: 40,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  renderItemView: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'grey',
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
  },
  nameView: {
    height: '100%',
    marginStart: 20,
    justifyContent: 'space-evenly',
  },
});

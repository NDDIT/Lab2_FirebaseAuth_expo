import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from '../colors';

const Chat = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Page</Text>
            {/* Thêm nút nếu cần */}
        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
        color: colors.primary, // Nếu bạn có màu chủ đề
    },
    chatButton: {
        backgroundColor: colors.primary,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.9,
        shadowRadius: 8,
        marginRight: 20,
        marginBottom: 50,
    }
});

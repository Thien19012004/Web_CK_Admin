import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'flowbite-react';

const Profile = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        avatar: '',
        role: '',
        registrationDate: ''
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

                setUser({
                    username: res.data.username || '',
                    email: res.data.email || '',
                    avatar: res.data.avatar || '',
                    role: res.data.role || 'user',
                    registrationDate: res.data.registrationDate || 'N/A'
                });
            } catch (error) {
                console.error('Lỗi khi tải thông tin người dùng:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('username', user.username);
            formData.append('email', user.email);
            if (avatarFile) formData.append('avatar', avatarFile);

            const res = await axios.put('http://localhost:5000/profile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            alert('Cập nhật thành công!');
            setUser(res.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                        <Card className="shadow-lg rounded-lg p-6">
                            <img
                                src={user.avatar || "https://via.placeholder.com/128?text=Avatar"}
                                alt="avatar"
                                className="rounded-full w-32 h-32 mx-auto object-cover border border-gray-300"
                            />
                            <h3 className="text-xl font-semibold text-center mt-4">{user.username}</h3>
                            <p className="text-gray-500 text-center">Full Stack Developer</p>
                            <p className="text-gray-400 text-center text-sm">{user.email}</p>
                            <div className="flex justify-center mt-4 gap-4">
                                <Button color="blue" onClick={handleEdit}>Cập nhật</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="w-full md:w-2/3">
                        <Card className="shadow-lg rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">User Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-500">Tên người dùng</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="username"
                                            value={user.username}
                                            onChange={handleChange}
                                            className="w-full border p-2 rounded"
                                        />
                                    ) : (
                                        <p>{user.username}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-500">Email</p>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={handleChange}
                                            className="w-full border p-2 rounded"
                                        />
                                    ) : (
                                        <p>{user.email}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-500">Vai trò</p>
                                    <p>{user.role}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-500">Ngày đăng ký</p>
                                    <p>{user.registrationDate}</p>
                                </div>
                                {isEditing && (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium">Avatar</label>
                                        <input type="file" onChange={handleAvatarChange} className="mt-2" />
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <div className="flex space-x-4 mt-4">
                                    <Button color = "cyan" onClick={handleUpdate} disabled={loading}>
                                        {loading ? 'Đang lưu...' : 'Lưu'}
                                    </Button>
                                    <Button color="gray" onClick={handleCancel}>Hủy</Button>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

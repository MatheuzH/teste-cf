"use client"
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import Link from "next/link";
import "./foods.css";

interface FoodItem {
  id: string;
  name: string;
  category: "Entrada" | "Prato Principal" | "Sobremesa" | "Bebida";
  price: number;
  description: string;
  availability: "Disponível" | "Indisponível";
}

export default function Foods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [newFood, setNewFood] = useState<Omit<FoodItem, "id">>({
    name: "",
    category: "Entrada",
    price: 0,
    description: "",
    availability: "Disponível",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editFoodId, setEditFoodId] = useState<string | null>(null);

  const foodsCollectionRef = collection(db, "Foods");

  useEffect(() => {
    const getFoods = async () => {
      const data = await getDocs(foodsCollectionRef);
      setFoods(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FoodItem))
      );
    };
    getFoods();
  }, []);

  const addFood = async () => {
    await addDoc(foodsCollectionRef, newFood);
    setIsModalOpen(false);
    const data = await getDocs(foodsCollectionRef);
    setFoods(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FoodItem))
    );
  };

  const openEditModal = (food: FoodItem) => {
    setEditFoodId(food.id);
    setNewFood({
      name: food.name,
      category: food.category,
      price: food.price,
      description: food.description,
      availability: food.availability,
    });
    setIsEditModalOpen(true);
  };

  const updateFood = async () => {
    if (!editFoodId) return;
    const foodDoc = doc(db, "Foods", editFoodId);
    await updateDoc(foodDoc, newFood);
    setIsEditModalOpen(false);
    setEditFoodId(null);
    const data = await getDocs(foodsCollectionRef);
    setFoods(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FoodItem))
    );
  };

  const deleteFood = async (id: string) => {
    const foodDoc = doc(db, "Foods", id);
    await deleteDoc(foodDoc);
    const data = await getDocs(foodsCollectionRef);
    setFoods(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as FoodItem))
    );
  };

  return (
    <div className="container-foods">
      <h1>Gerenciamento de Alimentos</h1>
      <button className="add-food-button" onClick={() => setIsModalOpen(true)}>
        Adicionar Alimento
      </button>
      <Link href="/login">
      <button className="add-food-button">
        Sair
      </button>
      </Link>
      
      <div className="food-grid">
        {foods.map((food) => (
          <div key={food.id} className="food-card">
            <h3>{food.name}</h3>
            <p>Categoria: {food.category}</p>
            <p>Preço: R${food.price.toFixed(2)}</p>
            <p>Descrição: {food.description}</p>
            <p>Disponibilidade: {food.availability}</p>
            <button onClick={() => openEditModal(food)}>Editar</button>
            <button onClick={() => deleteFood(food.id)}>Remover</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Alimento</h2>
            <input
              type="text"
              placeholder="Nome"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            />
            <select
              value={newFood.category}
              onChange={(e) =>
                setNewFood({
                  ...newFood,
                  category: e.target.value as FoodItem["category"],
                })
              }
            >
              <option value="Entrada">Entrada</option>
              <option value="Prato Principal">Prato Principal</option>
              <option value="Sobremesa">Sobremesa</option>
              <option value="Bebida">Bebida</option>
            </select>
            <input
              type="number"
              placeholder="Preço"
              value={newFood.price}
              onChange={(e) =>
                setNewFood({ ...newFood, price: Number(e.target.value) })
              }
            />
            <textarea
              placeholder="Descrição"
              value={newFood.description}
              onChange={(e) =>
                setNewFood({ ...newFood, description: e.target.value })
              }
            />
            <select
              value={newFood.availability}
              onChange={(e) =>
                setNewFood({
                  ...newFood,
                  availability: e.target.value as FoodItem["availability"],
                })
              }
            >
              <option value="Disponível">Disponível</option>
              <option value="Indisponível">Indisponível</option>
            </select>
            <button onClick={addFood}>Adicionar</button>
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Alimento</h2>
            <input
              type="text"
              placeholder="Nome"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            />
            <select
              value={newFood.category}
              onChange={(e) =>
                setNewFood({
                  ...newFood,
                  category: e.target.value as FoodItem["category"],
                })
              }
            >
              <option value="Entrada">Entrada</option>
              <option value="Prato Principal">Prato Principal</option>
              <option value="Sobremesa">Sobremesa</option>
              <option value="Bebida">Bebida</option>
            </select>
            <input
              type="number"
              placeholder="Preço"
              value={newFood.price}
              onChange={(e) =>
                setNewFood({ ...newFood, price: Number(e.target.value) })
              }
            />
            <textarea
              placeholder="Descrição"
              value={newFood.description}
              onChange={(e) =>
                setNewFood({ ...newFood, description: e.target.value })
              }
            />
            <select
              value={newFood.availability}
              onChange={(e) =>
                setNewFood({
                  ...newFood,
                  availability: e.target.value as FoodItem["availability"],
                })
              }
            >
              <option value="Disponível">Disponível</option>
              <option value="Indisponível">Indisponível</option>
            </select>
            <button onClick={updateFood}>Salvar Alterações</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

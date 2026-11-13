#!/usr/bin/env tsx

import "dotenv/config";
import prisma from "../db/prisma";
import bcrypt from "bcrypt";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required"
    );
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("Error: ADMIN_PASSWORD must be at least 6 characters long");
    process.exit(1);
  }

  try {
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists. Skipping.`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const admin = await prisma.user.create({
      data: {
        name: "Administrator",
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

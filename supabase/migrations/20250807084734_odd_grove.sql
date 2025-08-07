/*
  # Add INSERT policy for public ticket submission

  1. Security Changes
    - Add RLS policy to allow public users to insert tickets
    - This enables the bug report form to work for anonymous users
    - Maintains security by only allowing INSERT operations for public users

  2. Policy Details
    - Policy name: "Allow public ticket submission"
    - Operation: INSERT
    - Target: public (anonymous users)
    - Condition: No restrictions (WITH CHECK true)
*/

-- Add INSERT policy for public ticket submission
CREATE POLICY "Allow public ticket submission"
  ON public.tickets
  FOR INSERT
  TO public
  WITH CHECK (true);